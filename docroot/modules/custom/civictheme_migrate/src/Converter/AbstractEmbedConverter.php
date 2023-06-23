<?php

namespace Drupal\civictheme_migrate\Converter;

use Drupal\civictheme_migrate\LookupManager;
use Drupal\Component\Utility\Html;
use Drupal\Core\Entity\EntityInterface;

/**
 * Class AbstractEmbedConverter.
 *
 * Converts DOM elements to Drupal embed code.
 *
 * Implementing classes define the tags and lookups.
 */
abstract class AbstractEmbedConverter implements ConverterInterface {

  /**
   * The entity manager.
   *
   * @var \Drupal\civictheme_migrate\LookupManager
   */
  protected $entityManager;

  /**
   * A list of messages encountered during conversion.
   *
   * @var array
   */
  protected $messages = [];

  /**
   * Constructor.
   *
   * @param \Drupal\civictheme_migrate\LookupManager $entity_manager
   *   The entity manager.
   */
  public function __construct(LookupManager $entity_manager) {
    $this->entityManager = $entity_manager;
  }

  /**
   * Get the list of errors encountered during conversion.
   *
   * @return array
   *   The list of errors encountered during conversion.
   */
  public function getMessages() {
    return $this->messages;
  }

  /**
   * {@inheritdoc}
   */
  public function convert(mixed $value): mixed {
    if (!is_string($value)) {
      return $value;
    }

    $dom = Html::load($value);

    if (!$dom) {
      return $value;
    }

    foreach (static::getTags() as $tag) {
      $elements = $dom->getElementsByTagName($tag);
      if ($elements) {
        /** @var \DOMElement $element */
        foreach ($elements as $element) {
          $src = $this->getUrl($element);
          if (!$src) {
            continue;
          }

          $entity = $this->lookup($src);

          if (!$entity) {
            $this->messages[] = sprintf('Embed converter: entity with URI %s was not found.', $src);
            continue;
          }

          static::updateDomElement($element, $entity);
        }
      }
    }

    return Html::serialize($dom);
  }

  /**
   * Get the tags to convert.
   *
   * Implementing classes should return an array of tag names that the converter
   * should be run on.
   *
   * @return array
   *   The tags to convert.
   */
  abstract protected static function getTags(): array;

  /**
   * Get the URL from the DOM element.
   *
   * Implementing classes should define how to extract the URL from the DOM
   * element.
   *
   * @param \DOMElement $element
   *   The element to extract the URL from.
   *
   * @return string|null
   *   The URL or NULL if not found.
   */
  abstract protected function getUrl(\DOMElement $element): ?string;

  /**
   * Lookup entity by source.
   *
   * @param string $src
   *   The source to lookup.
   *
   * @return \Drupal\Core\Entity\EntityInterface|null
   *   The entity or NULL if not found.
   */
  abstract protected function lookup(string $src): ?EntityInterface;

  /**
   * Extract URL from DOM element.
   *
   * This is a helper method expected to be called from the getUrl() method of
   * the implementing class.
   *
   * @param \DOMElement $element
   *   The element to extract the URL from.
   * @param string $attribute_name
   *   The attribute name to extract the URL from.
   *
   * @return string|null
   *   The URL or NULL if not found.
   */
  protected static function extractUrlFromDomElement(\DOMElement $element, string $attribute_name): ?string {
    $uri = $element->getAttribute($attribute_name);

    if (!UrlHelper::isRelativeUrl($uri)) {
      return NULL;
    }

    if (UrlHelper::isAnchor($uri)) {
      return NULL;
    }

    $uri = UrlHelper::sanitiseRelativeUrl($uri);

    return $uri;
  }

  /**
   * Update DOM element with the entity URL and embed attributes.
   *
   * @param \DOMElement $element
   *   The element to update.
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity passed for context.
   */
  protected static function updateDomElement(\DOMElement $element, EntityInterface $entity): void {
    $element->setAttribute('href', $entity->toUrl()->toString());
    static::updateDomElementAttributes($element, $entity);
  }

  /**
   * Update attributes of the DOM element.
   *
   * @param \DOMElement $element
   *   The element to update.
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity passed for context.
   */
  protected static function updateDomElementAttributes(\DOMElement $element, EntityInterface $entity): void {
    $element->setAttribute('data-entity-type', $entity->getEntityTypeId());
    $element->setAttribute('data-entity-uuid', $entity->uuid());
    $element->setAttribute('data-entity-substitution', 'canonical');
  }

}
