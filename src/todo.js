// TODO item
class Item {

   // Constructor
   constructor (parentProject, title, description, dueDate, priority, id) {
      this.parentProject = parentProject; // (Project's id)
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.id = ((id === undefined) ? Date.now() : id);
      this.isCompleted = false;
   }

   // Parent project getter (project's id)
   getParentProject() {
      return this.parentProject;
   }

   // Title getter
   getTitle() {
      return this.title;
   }

   // Title setter
   setTitle (newTitle) {
      this.title = newTitle;
   }

   // Description getter
   getDescription() {
      return this.description;
   }

   // Description setter
   setDescription (newDescription) {
      this.description = newDescription;
   }

   // Due date getter
   getDueDate() {
      return this.dueDate;
   }

   // Due date setter
   setDueDate (newDueDate) {
      this.dueDate = newDueDate;
   }

   // Priority getter
   getPriority() {
      return this.priority;
   }

   // Priority setter
   setPriority (newPriority) {
      this.priority = newPriority;
   }

   // ID getter
   getID() {
      return this.id;
   }

   // Get whether the item is completed
   getIsCompleted() {
      return this.isCompleted;
   }

   // Toggle completion status of the item
   toggleCompletedStatus() {
      this.isCompleted = !this.isCompleted;
   }
}

class Project {

   // Constructor
   constructor (title, id) {
      this.title = title;
      this.id = id;
      this.itemList = [];
   }

   // Title getter
   getTitle() {
      return this.title;
   }

   // Title setter
   setTitle (newTitle) {
      this.title = newTitle;
   }

   // ID getter
   getID() {
      return this.id;
   }

   // ID setter
   setId (newID) {
      this.id = newID;
   }

   // Get number of list items
   getNumItems() {
      return this.itemList.length;
   }

   // Add an item to the list
   addItem (newItem) {
      this.itemList.push (newItem);
   }

   // Getthe index of an item in the list
   getItemIndex (itemID) {
      return this.itemList.findIndex (function (item) {
         return item.id === itemID;
      });
   }

   // Get an item from the list
   getItem (itemID) {

      // Look for item with specified ID
      let index = this.getItemIndex (itemID);

      // Return such item if it is in the list
      return (index === undefined) ? undefined : this.itemList[index];
   }

   // Get an item from the list specified by the index
   getItemByIndex (index) {

      // Retrieve specified item if the index is valid
      if (index >= 0 && index < this.getNumItems()) {
         return this.itemList[index];
      }
      return undefined;
   }

   // Erase an item from the list
   eraseItem (itemID) {

      // Look for item with specified ID
      let index = this.getItemIndex (itemID);

      // Remove such item from the list if it is there
      if (index !== undefined) {
         this.itemList.splice (index, 1);
      }
   }

   // Get percentage of items completed in this project
   getCompletionStatus() {

      let numItems = this.getNumItems();

      if (numItems <= 0) {
         return "Empty";
      } else {
         // Keep track of how many items in this project are completed
         let completedItems = 0;

         // Iterate through list of items to find out how many items are completed
         for (let i = 0; i < numItems; i++) {
            if (this.getItemByIndex (i).getIsCompleted()) {
               completedItems++;
            }
         }

         // Do the math and return the result
         return ((completedItems / numItems * 100).toFixed (0)) + "%";
      }
   }

   // Sort items list by a specified criterion
   sortItemsBy (criterion) {
      switch (criterion) {
         default:
         case "creationUp":
            this.itemList.sort (function (a, b) {
               return a.id - b.id;
            });
            break;
         case "creationDown":
            this.itemList.sort (function (a, b) {
               return b.id - a.id;
            });
            break;
         case "priorityUp":
            this.itemList.sort (function (a, b) {
               return a.priority - b.priority;
            });
            break;
         case "priorityDown":
            this.itemList.sort (function (a, b) {
               return b.priority - a.priority;
            });
            break;
         case "dueDateUp":
            this.itemList.sort (function (a, b) {
               let dateA = new Date (a.getDueDate());
               let dateB = new Date (b.getDueDate());
               return dateA.getTime() - dateB.getTime();
            });
            break;
         case "dueDateDown":
            this.itemList.sort (function (a, b) {
               let dateA = new Date (a.getDueDate());
               let dateB = new Date (b.getDueDate());
               return dateB.getTime() - dateA.getTime();
            });
            break;
      }
   }
}

class AppManager {

   // Constructor
   constructor() {
      this.projectList = [];
   }

   // Get the number of projects in the list of projects
   getNumProjects() {
      return this.projectList.length;
   }

   // Add a project to the list of projects
   addProject (newTitle, id) {

      // Create a unique ID for the new project
      let newID = id === undefined ? Date.now() : id;

      // Create project
      let newProject = new Project (newTitle, newID);

      // Add the new project to tthe list
      this.projectList.push (newProject);
   }

   // Remove a project from the list of projects
   removeProject (projectID) {

      // Target project index
      let projectIndex = -1;

      // Find index of the project with matching ID
      for (let i = 0; i < this.projectList.length; i++) {
         if (projectID === this.projectList[i].getID()) {
            projectIndex = i;
            break;
         }
      }

      // Remove project from list if found
      if (projectIndex >= 0) {
         this.projectList.splice (projectIndex, 1);
      }
   }

   // Get a project from the list of projects
   getProject (projectID) {

      // Cycle through all projects until the one with matching ID is found
      for (let i = 0; i < this.projectList.length; i++) {
         if (projectID === this.projectList[i].getID()) {

            // Return the project with matching ID
            return this.projectList[i];
         }
      }

      // If no project with matching ID found, return null
      return null;
   }

   // Get a project from thelist of projects given an index
   getProjectByIndex (projectIndex) {

      // Get project if index is valid
      if (projectIndex >= 0 && projectIndex < this.getNumProjects()) {
         return this.projectList[projectIndex];
      }
      return null;
   }

   // Get the list of projects
   getProjectList() {
      return this.projectList;
   }

   // Add an item to a project
   addItem (projectID, newTitle, newDescription, newDueDate, newPriority, id) {

      // Create a unique ID for the new item (copy the given one, if specified)
      let newID = id === undefined ? Date.now() : id;

      // Create new item
      let newItem = new Item (projectID, newTitle, newDescription, newDueDate, newPriority, newID);

      // Add the new item to its project
      let project = this.getProject (projectID);
      project.addItem (newItem);
   }

   removeItemFromProject (itemID, projectID) {
      this.getProject (projectID).eraseItem (itemID);
   }

   getItemFromProject (itemID, projectID) {
      return this.getProject (projectID).getItem (itemID);
   }

   getItemByIndexFromProject (itemIndex, projectID) {
      return this.getProject (projectID).getItemByIndex (itemIndex);
   }

   // Get the list of items from a specified project
   getItemListFromProject (projectID) {

      // Get the specified project
      let project = this.getProject (projectID);

      // Return the item list
      return project.itemList;
   }

   // Reorganize items in each project list by changing the sorting method
   changeSortMethod (criterion) {
      for (let i = 0; i < this.getNumProjects(); i++) {
         this.getProjectByIndex (i).sortItemsBy (criterion);
      }
   }

   // Delete all projects and their data
   eraseProjectData() {
      while (this.getNumProjects() > 0) {
         this.removeProject (this.getProjectByIndex (0).getID());
      }
   }

   // Get all current project data as JSON
   getJSON() {

      // Container for the final object
      let finalJSON = [];

      // Cycle through all projects
      for (let i = 0; i < this.getNumProjects(); i++) {

         // Current project
         let project = this.getProjectByIndex (i);

         // Project container
         let projectOBJ = {};

         // Project values
         projectOBJ.title = project.getTitle();
         projectOBJ.id = project.getID();
         projectOBJ.items = [];

         // Cycle through all items in the current project
         for (let j = 0; j < project.getNumItems(); j++) {

            // Current item
            let item = project.getItemByIndex (j);

            // Item container
            let itemOBJ = {};

            // Item values
            itemOBJ.parentProject = item.getParentProject();
            itemOBJ.id = item.getID();
            itemOBJ.title = item.getTitle();
            itemOBJ.description = item.getDescription();
            itemOBJ.dueDate = item.getDueDate();
            itemOBJ.priority = item.getPriority();
            itemOBJ.isCompleted = item.getIsCompleted();

            // Add item container to project container list
            projectOBJ.items.push (itemOBJ);
         }

         // Add project container to final object
         finalJSON.push (projectOBJ);
      }

      // Return the final object
      return finalJSON;
   }

   // Create all project data from a specified JSON object (format is assumed)
   loadFromJSON (JSON) {

      // Cycle through all projects in JSON
      for (let i = 0; i < JSON.length; i++) {

         // Current project
         let project = JSON[i];

         // Add current project
         this.addProject (project.title, project.id);

         // Cycle through all items in current project
         for (let j = 0; j < project.items.length; j++) {

            // Current item
            let item = project.items[j];

            // Add current item
            this.addItem (item.parentProject, item.title, item.description, item.dueDate, item.priority, item.id);

            // Toggle item completion if item is completed
            if (item.isCompleted) {
               this.getProjectByIndex (i).getItemByIndex (j).toggleCompletedStatus();
            }
         }
      }
   }

   // Save app data
   saveAppData (itemsToSave) {

      // Save project data
      if (itemsToSave.projectData) {
         localStorage.setItem ("STProjectData", JSON.stringify (this.getJSON()));
      }

      // Sort method
      if (itemsToSave.sortMethod) {
         localStorage.setItem ("STSortMethod", itemsToSave.sortMethod);
      }

      // Theme
      if (itemsToSave.theme) {
         localStorage.setItem ("STTheme", itemsToSave.theme);
      }

      // Option to show the completion status of projects
      if (itemsToSave.showCompletionStatus !== undefined) {
         localStorage.setItem ("STShowCompletionStatus", itemsToSave.showCompletionStatus);
      }
   }

   // Load app data
   loadAppData() {

      // Items to load
      let sortMethod, theme, showCompletionStatus;
      sortMethod = theme = showCompletionStatus = null;

      // Project data
      if (localStorage.getItem ("STProjectData")) {
         this.loadFromJSON (JSON.parse (localStorage.getItem ("STProjectData")));
      }

      // Sort method
      if (localStorage.getItem ("STSortMethod")) {
         sortMethod = localStorage.getItem ("STSortMethod");
      }

      // Theme
      if (localStorage.getItem ("STTheme")) {
         theme = parseInt (localStorage.getItem ("STTheme"));
      }

      // Option to show the completion status of projects
      if (localStorage.getItem ("STShowCompletionStatus")) {
         if (localStorage.getItem ("STShowCompletionStatus") === "true") {
            showCompletionStatus = true;
         } else {
            showCompletionStatus = false;
         }
      }

      // Return the things to load
      return {sortMethod, theme, showCompletionStatus};
   }

   // Load a specified theme
   loadTheme (theme) {

      // Load colors depending on theme selected
      switch (theme) {
         default:
            break;
         // Clean
         case 0:
            document.documentElement.style.setProperty ("--bg-color-1", "white");
            document.documentElement.style.setProperty ("--bg-color-2", "#333333");
            document.documentElement.style.setProperty ("--text-color-1", "black");
            document.documentElement.style.setProperty ("--text-color-2", "white");
            document.documentElement.style.setProperty ("--card-bg-color-1", "white");
            document.documentElement.style.setProperty ("--card-bg-color-2", "#cccccc");
            document.documentElement.style.setProperty ("--card-text", "black");
            document.documentElement.style.setProperty ("--form-bg-color", "#cccccc");
            document.documentElement.style.setProperty ("--form-text-color", "black");
            break;
         // Orchid
         case 1:
            document.documentElement.style.setProperty ("--bg-color-1", "#f9b4ed");
            document.documentElement.style.setProperty ("--bg-color-2", "#334139");
            document.documentElement.style.setProperty ("--text-color-1", "black");
            document.documentElement.style.setProperty ("--text-color-2", "white");
            document.documentElement.style.setProperty ("--card-bg-color-1", "#e574bc");
            document.documentElement.style.setProperty ("--card-bg-color-2", "#c52184");
            document.documentElement.style.setProperty ("--card-text", "black");
            document.documentElement.style.setProperty ("--form-bg-color", "#e574bc");
            document.documentElement.style.setProperty ("--form-text-color", "black");
            break;
         // Grey Alabaster
         case 2:
            document.documentElement.style.setProperty ("--bg-color-1", "#8a817C");
            document.documentElement.style.setProperty ("--bg-color-2", "#463f3a");
            document.documentElement.style.setProperty ("--text-color-1", "white");
            document.documentElement.style.setProperty ("--text-color-2", "white");
            document.documentElement.style.setProperty ("--card-bg-color-1", "#bcb8b1");
            document.documentElement.style.setProperty ("--card-bg-color-2", "#e0afa0");
            document.documentElement.style.setProperty ("--card-text", "black");
            document.documentElement.style.setProperty ("--form-bg-color", "#e0afa0");
            document.documentElement.style.setProperty ("--form-text-color", "black");
            break;
         // Blue Orange
         case 3:
            document.documentElement.style.setProperty ("--bg-color-1", "#283845");
            document.documentElement.style.setProperty ("--bg-color-2", "#f29559");
            document.documentElement.style.setProperty ("--text-color-1", "white");
            document.documentElement.style.setProperty ("--text-color-2", "black");
            document.documentElement.style.setProperty ("--card-bg-color-1", "#f29559");
            document.documentElement.style.setProperty ("--card-bg-color-2", "#f2d492");
            document.documentElement.style.setProperty ("--card-text", "black");
            document.documentElement.style.setProperty ("--form-bg-color", "#f2d492");
            document.documentElement.style.setProperty ("--form-text-color", "black");
            break;
         // Dodger
         case 4:
            document.documentElement.style.setProperty ("--bg-color-1", "#4bb3fd");
            document.documentElement.style.setProperty ("--bg-color-2", "#00487c");
            document.documentElement.style.setProperty ("--text-color-1", "white");
            document.documentElement.style.setProperty ("--text-color-2", "white");
            document.documentElement.style.setProperty ("--card-bg-color-1", "#027bce");
            document.documentElement.style.setProperty ("--card-bg-color-2", "#3e6680");
            document.documentElement.style.setProperty ("--card-text-color", "white");
            document.documentElement.style.setProperty ("--form-bg-color", "#027bce");
            document.documentElement.style.setProperty ("--form-text-color", "white");
            break;
         // Rainy
         case 5:
            document.documentElement.style.setProperty ("--bg-color-1", "#a5ccd1");
            document.documentElement.style.setProperty ("--bg-color-2", "#949ba0");
            document.documentElement.style.setProperty ("--text-color-1", "black");
            document.documentElement.style.setProperty ("--text-color-2", "white");
            document.documentElement.style.setProperty ("--card-bg-color-1", "#bcd4de");
            document.documentElement.style.setProperty ("--card-bg-color-2", "#9dacb2");
            document.documentElement.style.setProperty ("--card-text-color", "black");
            document.documentElement.style.setProperty ("--form-bg-color", "#bcd4de");
            document.documentElement.style.setProperty ("--form-text-color", "black");
            break;
      }
   }
}

export {Item, Project, AppManager};