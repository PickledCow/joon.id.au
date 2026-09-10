import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Blog/API endpoints are prerendered and do not need theme handling.
    if (event.route.id?.startsWith("/api/")) {
        return resolve(event);
    }

    let theme: string | null = null;

    const newTheme = event.url.searchParams.get("theme");
    const cookieTheme = event.cookies.get("colortheme");

    if (newTheme === "dark" || newTheme === "light") {
        theme = newTheme;
    } else if (cookieTheme === "dark" || cookieTheme === "light") {
        theme = cookieTheme;
    }

    if (theme === "dark") {
        return resolve(event, {
            transformPageChunk: ({ html }) =>
                html.replace("<body", '<body class="dark"')
        });
    }

    return resolve(event);
};