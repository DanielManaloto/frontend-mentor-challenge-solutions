# Frontend Mentor - Bento grid solution

This is a solution to the [Bento grid challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/bento-grid-RMydElrlOj). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

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
- [Author](#author)
- [Acknowledgments](#acknowledgments)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the interface depending on their device's screen size

### Screenshot

![](./screenshot/desktop-design.png)
<p style="text-align: center;">Desktop Design</p>

![](./screenshot/mobile-design.png)
<p style="text-align: center;">Mobile Design</p>


### Links

- Solution URL: [Vercel](https://frontend-mentor-challenge-solutions-five.vercel.app/bento-grid-main/)
- Live Site URL: [GitHub](https://github.com/DanielManaloto/frontend-mentor-challenge-solutions/tree/main/bento-grid-main)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- VS Code

### What I learned

While working in this solution i learned to use CSS for defining the overall grid structure before placing HTML content inside it and placing multiple items into the same grid cells to layer them easily without messy absolute positioning. 

This solution start with mobile first design for better ordering. Grid shines in for structuring html design like the code below. Grid allows to allocate areas for elements using `grid-template-areas` then defining what `grid-area` an element is. 

```css
.main-grid {
    margin-inline: auto;

    display: grid;
    gap: 20px;

    grid-template-columns: 1fr;
    grid-template-areas:
        "box-1"
        "box-2"
        "box-3"
        "box-4"
        "box-5"
        "box-6"
        "box-7"
        "box-8";
}

#bento-box1 {
    grid-area: box-1;
}

#bento-box2 {
    grid-area: box-2;
}

#bento-box3 {
    grid-area: box-3;
}
```

I also explored on using media query for responsive design

```css
@media (min-width: 600px) and (max-width: 799px) {

    .main-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        grid-template-areas:
            "box-1 box-1"
            "box-2 box-3"
            "box-4 box-4"
            "box-6 box-5"
            "box-7 box-8";
    }
}
```
### Continued development

For now, I don't have any specific plans for continued development. I want to keep practicing by working on more projects and gradually improve my HTML and CSS skills as I gain more experience.

### Useful resources

- [Malven](https://grid.malven.co/) – CSS Grid Cheatsheet: I used this resource to better understand CSS Grid and how to arrange elements into rows and columns. The visual examples made it easier for me to figure out the layout and spacing I needed for this challenge.

### AI Collaboration

In creating this solution, AI was used mainly for debugging and exploring possible solutions to various errors and bugs encountered throughout development. I mainly used the Claude Sonnet 5 model available on the website. AI-generated code was used as minimally as possible so that I could continue learning and developing my skills in frontend programming.

## Author

- GitHub - [DanielManaloto](https://github.com/DanielManaloto)

## Acknowledgments

I would like to thank Frontend Mentor for providing the challenge and the opportunity to practice and improve my frontend development skills.

