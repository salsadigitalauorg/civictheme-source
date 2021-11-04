import { boolean, radios, text } from '@storybook/addon-knobs';

import CivicBasicContent from './basic-content.twig';
import CivicLink from '../../01-atoms/link/link.twig';
import CivicTable from '../../01-atoms/table/table.twig';
import CivicImage from '../../01-atoms/image/image.twig';
import CivicVideo from '../video/video.twig';
import imageFile from '../../../assets/image.png';

export default {
  title: 'Molecules/Basic Content',
  parameters: {
    layout: 'fullscreen',
    knobs: {
      escapeHTML: false,
    },
  },
};

export const BasicContent = (knobTab) => {
  const generalKnobTab = typeof knobTab === 'string' ? knobTab : 'General';

  const theme = radios(
    'Theme', {
      Light: 'light',
      Dark: 'dark',
    },
    'light',
    generalKnobTab,
  );

  let html = '';

  // Headings.
  html += `
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
  `;

  // Paragraphs.
  html += `
    <p>Text without a class sed aute in sed consequat veniam excepteur minim mollit.</p>
    <p class="civic-text-large">Large text sed aute in sed consequat veniam excepteur minim mollit.</p>
    <p class="civic-text-regular">Regular text veniam reprehenderit velit ea veniam occaecat magna est sed duis quis elit occaecat dolore ut enim est do in dolor non elit aliquip commodo aliquip sint veniam ullamco adipisicing tempor ad.</p>
    <p class="civic-text-small">Small text <span>duis sunt velit.</span><span>Ea eu non.</span></p>
    <p>In mollit in minim ut non ${CivicLink({
    theme,
    text: 'commodo dolore',
    url: 'https://example.com',
  })} nisi anim.</p>
    <p>Deserunt in ex dolore. <sup>Super cupidatat esse.</sup> <sub>Sub do mollit aute labore.</sub></p>
  `;

  // Blockquote.
  html += `
    <blockquote cite="https://example.com">Culpa laboris sit fugiat minim ad commodo eu id sint eu sed nisi.</blockquote>
  `;

  // Lists.
  html += `
    <ul>
      <li>Sint pariatur quis tempor.</li>
      <li>Lorem ipsum dolore laborum nulla ut.</li>
      <li>Deserunt ullamco occaecat anim cillum.</li>
    </ul>
    <ol>
      <li>Id nostrud id sit nulla.</li>
      <li>Dolore ea cillum culpa nulla.</li>
      <li>Lorem ipsum ex excepteur.</li>
    </ol>
  `;

  // Image.
  html += CivicImage({
    theme,
    src: imageFile,
    alt: 'Occaecat laborum voluptate cupidatat.',
    caption: 'Commodo anim sint minim.',
  });

  // Video.
  html += CivicVideo({
    theme,
    src: 'https://www.youtube.com/embed/C0DPdy98e4c',
  });

  // Table.
  html += CivicTable({
    theme,
    header: [
      'Column A',
      'Column B',
      'Column C',
    ],
    rows: [
      [
        'Do duis minim cupidatat eu.',
        'Ullamco sunt dolore.',
        'Dolor in officia.',
      ],
      [
        'Do duis minim cupidatat eu.',
        'Ullamco sunt dolore.',
        'Dolor in officia.',
      ],
      [
        'Lorem ipsum magna sint.',
        'Consequat qui anim.',
        'Lorem ipsum aliqua veniam deserunt.',
      ],
    ],
  });

  const generalKnobs = {
    theme,
    content: boolean('Content', true, generalKnobTab) ? html : null,
    modifier_class: text('Additional class', '', generalKnobTab),
  };

  return CivicBasicContent({
    ...generalKnobs,
  });
};
