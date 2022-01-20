/// <reference types="@sveltejs/kit" />

/*** begin sveltekit-svg plugin ***/
declare module '*.svg' {
  import { SvelteComponent } from 'svelte'
  const content: SvelteComponent
  export default content
}

declare module '*.svg?component' {
  import { SvelteComponent } from 'svelte'
  const content: SvelteComponent
  export default content
}

declare module '*.svg?src' {
  const content: string
  export default content
}

declare module '*.svg?url' {
  const content: string
  export default content
}
/*** end sveltekit-svg plugin ***/
