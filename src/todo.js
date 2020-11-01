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
      if (this.getNumItems <= 0) {
         return "Empty";
      } else {
         // Keep track of how many items in this project are completed
         let numItems = this.getNumItems;
         let completedItems = 0;

         // Iterate through list of items to find out how many items are completed
         for (let i = 0; i < numItems; i++) {
            if (this.getItem (i).isCompleted) {
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
   addProject (newTitle) {

      // Create a unique ID for the new project
      let newID = Date.now();

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
   addItem (projectID, newTitle, newDescription, newDueDate, newPriority) {

      // Create a unique ID for the new item
      let newID = Date.now();

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
}

export {Item, Project, AppManager};