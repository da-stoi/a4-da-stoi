# Recipe Book

- Author: [Daniel Stoiber](https://danielstoiber.com)
- Published site: [https://a4-da-stoi.stoiber.network](https://a4-da-stoi.stoiber.network)

This project was a continuation of the continuation of the second assignment, where I created a simple recipe application. The goal of this application was to convert my work from pervious assignments into a full stack application. This application allows users to add, modify, and delete recipes. Users can also search for recipes by name. The application uses MongoDB to store the data between server sessions. The application also uses OAuth authentication via the GitHub strategy. The application is hosted on Vercel (actually this time). I am much more in my element now. It's good to go back to basics every so often. I really take tools like Next.js for granted.

## Added Features

- **A complete UI library:** Shadcn is used in this new version to make the application look more professional.
- **Auth.js (formerly Next Auth):** Users can now sign in with their GitHub account using Auth.js connected to mongodb.
- **Quick Search:** Instead of searching on the server side, the entire recipe list is stored and then filtered on the client side.
- **Public Recipe Viewing:** Anyone is able to view and search for all recipes. Users must be logged in to add a new recipe or modify their own.
- **Toggle-able Dark Mode:** The previous version did have a system theme based dark mode. If the system was set to light or dark mode, the site would reflect that. On top of that I have added a theme selector.
- **Sign Out Button:** I have added a sign out button.
- **Side-by-side Ingredients and Instructions:** Ingredients and instructions are now side-by-side when there is enough space for it.
- **Responsive Design:** My previous versions also had responsive design, but this new version has much more with different sections hiding or shrinking depending on screen width.
- **Add Buttons:** The input to add ingredients and instructions now has a button to the right that does the same as pressing enter as a visual aid for those not comfortable with keyboard shortcuts.
