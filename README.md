# webpagetemplate

## Mobile Screen Rail Component
Use `MobileScreenRail` to embed horizontally scrollable mobile mockups (ideal for project pages).

```jsx
import { MobileScreenRail } from './Components/MobileScreenRail/MobileScreenRail';

const screens = [
  {
    lead: 'Design System',
    title: 'Balance focus time',
    body: 'Daily check-ins and adaptive prompts summarize the AI co-creation workflow.',
    image: `${process.env.PUBLIC_URL}/projects/my-project/mobile_1.png`
  },
  {
    lead: 'Research log',
    title: 'Capture sketches instantly',
    body: 'Every iteration is saved as a card to share in studio critiques.',
    image: `${process.env.PUBLIC_URL}/projects/my-project/mobile_2.png`
  }
];

<MobileScreenRail
  heading="Prototype Screens"
  description="Swipe to explore the flows we tested with participants."
  screens={screens}
  cardWidth="clamp(240px, 28vw, 360px)"
  cardHeight="auto"
/>
```

Props:
- `screens`: array of `{ lead?, title?, body?, image (required), alt? }`
- `heading`, `description`: optional intro copy
- `cardWidth`, `cardHeight`: number (px) or CSS length string to control card size (`cardHeight` defaults to `auto` so images keep their native ratio)
- `gap`: spacing between cards (px)
- `showMetadata`: hide the text blocks when you only want the visual screens
- `clampToContainer`: align the first/last cards with the surrounding layout and prevent overscroll
