export function simpleMailContent(firstName: string, text: string) {
  return `
<div class="greeting">
  Hello ${firstName},
</div>

<div class="message">
  <p>${text}</p>
</div>
        `;
}
