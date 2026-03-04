import type { Handle } from "@sveltejs/kit";

export const handle: Handle = (async ({ event, resolve }) => {
    let theme: string | null = null;
    
    const newTheme = event.url.searchParams.get("theme");
    const cookieTheme = event.cookies.get("colortheme");

    if (newTheme) {
        if (newTheme === "dark" || newTheme === "light") { // Validate theme value
            theme = newTheme;
        }
    } else if (cookieTheme) {
        if (cookieTheme === "dark" || cookieTheme === "light") { // Validate theme value
            theme = cookieTheme;
        }
    }
    
    if (theme) {
        if (theme === "dark") {
            return await resolve(event, {
                // Modify the body to include class "dark-mode" to prevent flash of light mode on initial load if dark mode is set
                transformPageChunk: ({ html }) => html.replace('<body', `<body class="dark"`)
            });
        }
    }

    return await resolve(event);

}) satisfies Handle;
        