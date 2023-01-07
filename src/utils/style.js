const $head  = document.head;
const $link  = $head.querySelector('link[rel="stylesheet"]') || $head.querySelector('style'); // ref
const $style = document.createElement('style');

$link ? $link.before($style) : $head.append($style);

export default function style(selector, rule) {
      rule = Object.entries(rule).map(([key, value]) => {
            key = key.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
            return `${key}: ${value}`;
      });

      $style.innerText += `${selector} {${rule.join(';')}} \n`;
}
