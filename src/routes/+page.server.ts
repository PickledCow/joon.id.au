import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    setTheme: async ({ url, cookies }) => {
        const theme = url.searchParams.get("theme");

        if (theme) {
            if (theme === "dark" || theme === "light") { // Validate theme value
                cookies.set("colortheme", theme, {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 365 // 1 year
                });
            }
        }
    }
};
