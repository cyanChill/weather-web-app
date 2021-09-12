import { updatePageContents } from "./pageUpdate";
import { updateSessionCache } from "./utility";

/* Code for dealing with the search functionality */
const searchBar = (function () {
  const searchForm = document.getElementById("search-bar");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const location = e.target["search-field"].value;

    const newRecievedInfo = await updatePageContents(location, { forceUpdate: true });

    if (newRecievedInfo) {
      e.target.reset();
      updateSessionCache("cachedInfo", newRecievedInfo);
    }
  });
})();

export default searchBar;
