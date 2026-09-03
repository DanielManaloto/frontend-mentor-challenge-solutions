# Frontend Mentor - Order summary card solution

This is a solution to the [Order summary card challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/order-summary-component-QlPmajDUj). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- See hover states for interactive elements

### Screenshot
 
 
### Links
 
- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)
## My process
 
### Built with
 
- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Mobile-first workflow
 
### What I learned
 
This project was mainly about getting comfortable with Flexbox for both centering and structuring a small card layout.
 
The first thing I learned was how easy Flexbox makes vertical *and* horizontal centering at the same time — something that used to take a lot of trial and error with margins. Just two properties on the `main` element centers the whole card on the page, no matter the viewport size:
 
```css
main {
    width: 100%;
    min-height: 100vh;
    padding: 20px 0;
 
    display: flex;
    align-items: center;
    justify-content: center;
}
```
 
From there, I used `flex-direction: column` to stack the card's contents (image, heading, paragraph, payment plan box, buttons) top to bottom, which is the default block-like behavior but gives me the extra control of `align-items` for horizontal alignment within the column:
 
```css
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    ...
}
```
 
The part I'm most proud of is the payment plan row. Instead of using Grid or absolute positioning to place the icon, text, and "Change" button, I laid it out as a simple flex row and pushed the button to the far right with `margin-left: auto`:
 
```css
.payment-plan-container {
    display: flex;
    flex-direction: row;
    ...
}
 
#change-btn {
    border: none;
    background-color: transparent;
    margin-left: auto;
    ...
}
```
 
I learned that `margin-left: auto` on a flex child is a really handy alternative to `justify-content: space-between` when you only want *one* item pushed away from its siblings rather than spreading everything evenly.
 
### Continued development
 
Use this section to outline areas that you want to continue focusing on in future projects. These could be concepts you're still not completely comfortable with or techniques you found useful that you want to refine and perfect.

 
### Useful resources
 
- [CSS-Tricks – A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - This was my go-to reference for the full list of Flexbox properties. Having the container and item properties side by side made it quick to look up things like `align-items` vs `align-self` while I was building the card.
- [MDN – Basic Concepts of Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) - Helped me understand *why* Flexbox behaves the way it does (main axis vs cross axis), which made properties like `justify-content` and `align-items` click instead of feeling like something to memorize.
- [Flexbox Froggy](https://flexboxfroggy.com/) - A fun, hands-on way to practice Flexbox properties. Playing through a few levels here is what helped `margin-left: auto` finally make sense to me as a way to push a single item away from the rest.

### AI Collaboration

In creating this solution, AI was used mainly for debugging and exploring possible solutions to various errors and bugs encountered throughout development. I mainly used the Claude Sonnet 5 model available on the website. AI-generated code was used as minimally as possible so that I could continue learning and developing my skills in frontend programming.

## Author

- GitHub - [DanielManaloto](https://github.com/DanielManaloto)

## Acknowledgments

I would like to thank Frontend Mentor for providing the challenge and the opportunity to practice and improve my frontend development skills.
