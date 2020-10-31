// Import React library for creating components
import React from 'react';

// Import our TODO API thingy
import {Item, Project, AppManager} from "./todo";

//==== TEST STUFF ====//
var appManager = new AppManager();
//====================//

// Renders the web app (back to root node)
function App() {
   return (
      <>
         <AppHeader />
         <AppContent />
         <AppFooter />
      </>
  );
}

// Web app title and settings
class AppHeader extends React.Component {
   /* TODO
      - Implement settings
      - Finalize CSS
   */

   render() {
      return(
         <div className="app-header">
            <h1>Simple TODO <span className="stay-right">&#9776;</span></h1>
         </div>
      );
   }
}

// Body of the web app
class AppContent extends React.Component {
   /* TODO
      - Work on the other of components that will be invoked from here
   */

   constructor (props) {
      super (props);
      this.state = {
         view: "main_view",
         project: null
      };
      this.enterProject = this.enterProject.bind (this);
      this.enterMainView = this.enterMainView.bind (this);
      this.enterAllItemsView = this.enterAllItemsView.bind (this);
   }

   enterProject (targetProject) {
      this.setState ({view: "project_view"});
      this.setState ({project: targetProject});
   }

   enterMainView() {
      this.setState ({view: "main_view"});
      this.setState ({project: null});
   }

   enterAllItemsView() {
      this.setState ({view: "all_items_view"});
      this.setState ({project: null});
   }

   render() {
      return (
         <div className="app-content">
            {this.state.view === "main_view" &&
               <MainView projectClick={this.enterProject} allItemsClick={this.enterAllItemsView} />
            }
            {this.state.view === "project_view" &&
               <ProjectView project={this.state.project} linkBack={this.enterMainView} />
            }
            {this.state.view === "all_items_view" &&
               <AllItemsView linkBack={this.enterMainView} />
            }
         </div>
      );
   }
}

// Footer of the web app (basic info about... idk)
class AppFooter extends React.Component {
   /* TODO
      - I guess put a link to this project on GitHub
      - Maybe put my name or something idk man
      - Be creative, what are footers for?
   */

   render() {
      return (
         <div className="app-footer">
            <span>Footer here</span>
         </div>
      );
   }
}

// List of projects, opening view when opening app
class MainView extends React.Component {
   /* TODO
      - Work on the other components that will be invoked from here
   */

   constructor (props) {
      super (props);
      this.state = {projectForm: false};
      this.openProjectForm = this.openProjectForm.bind (this);
      this.closeProjectForm = this.closeProjectForm.bind (this);
   }

   openProjectForm() {
      this.setState ({projectForm: true});
   }

   closeProjectForm() {
      this.setState ({projectForm: false});
   }

   render () {
      const listProjects = appManager.getProjectList().map (function (project) {
         return <ProjectCard project={project} projectClick={this.props.projectClick} key={project.getID()} />;
      }, this);

      return (
         <>
            <h2>Projects<span className="stay-right"><button className="circle-button" onClick={this.openProjectForm}>+</button> | <button className="circle-button" onClick={this.props.allItemsClick}>All items</button></span></h2>
            {listProjects}
            {this.state.projectForm && <ProjectForm onCreate={this.closeProjectForm} onCancel={this.closeProjectForm} />}
         </>
      );
   }
}

// List of items in a specific project
class ProjectView extends React.Component {
   /* TODO
      - Finalize CSS
   */

   /*
      -- Floating menu --

      0. Not visible
      1. Item form
      2. Project edit form
      3. Project delete form
   */

   constructor (props) {
      super (props);
      this.state = {
         floatingMenu: 0,
         targetItem : 0,
         refresh: 0
      };
      this.linkBackClick = this.linkBackClick.bind (this);
      this.closeFloatingMenu = this.closeFloatingMenu.bind (this);
      this.openItemForm = this.openItemForm.bind (this);
      this.openProjectEditForm = this.openProjectEditForm.bind (this);
      this.openProjectDeletePrompt = this.openProjectDeletePrompt.bind (this);
      this.deleteProject = this.deleteProject.bind (this);
      this.refreshView = this.refreshView.bind (this);
   }

   linkBackClick() {
      this.props.linkBack();
   }

   closeFloatingMenu() {
      this.setState ({floatingMenu: 0});
   }

   openItemForm() {
      this.setState ({floatingMenu: 1});
   }

   openProjectEditForm() {
      this.setState ({floatingMenu: 2});
   }

   openProjectDeletePrompt() {
      this.setState ({floatingMenu: 3});
   }

   deleteProject() {
      this.props.linkBack();
      appManager.removeProject (this.props.project.getID());
   }

   refreshView() {
      this.setState ({refresh: 1});
   }

   render() {

      // Create list of TODO items to show
      const items = [];
      for (let i = 0; i < this.props.project.getNumItems(); i++) {
         items.push (this.props.project.getItemByIndex (i));
      }
      const listItems = items.map (function (item) {
         return <ItemCard item={item} key={item.getID()} refresh={this.refreshView} />;
      }, this);

      // Create warning prompt for project deletion
      const projectDeletePrompt = "Are you sure you want to delete project '" + this.props.project.getTitle() + "'? (There is no undo)";

      // Whether a floating menu should be visible
      let floatingMenu = null;
      switch (this.state.floatingMenu) {
         default:
         case 0:
            break;
         case 1:
            floatingMenu = <ItemForm onCreate={this.closeFloatingMenu} onCancel={this.closeFloatingMenu} projectID={this.props.project.getID()} />;
            break;
         case 2:
            floatingMenu = <ProjectEditForm onEdit={this.closeFloatingMenu} onCancel={this.closeFloatingMenu} project={this.props.project} />;
            break;
         case 3:
            floatingMenu = <ConfirmationPrompt prompt={projectDeletePrompt} onAccept={this.deleteProject} onCancel={this.closeFloatingMenu} />;
            break;
      }

      return (
         <>
            <h3 className="link-to-projects" onClick={this.linkBackClick}>&lt; Projects</h3>
            <h2>
               {this.props.project.getTitle()}
               <span className="stay-right">
                  <span className="circle-button" onClick={this.openItemForm}>+</span>
                  <div className="options-menu">
                     <span className="circle-button">&#8942;</span>
                     <div className="options-menu-items">
                        <span onClick={this.openProjectEditForm}>Edit project</span>
                        <span onClick={this.openProjectDeletePrompt}>Delete project</span>
                     </div>
                  </div>
               </span>
            </h2>
            {listItems}
            {(floatingMenu !== null) && floatingMenu}
         </>
      );
   }
}

// Shows project title, options when hovered
class ProjectCard extends React.Component {
   /* TODO
      - Add options when hovering
      - Finalize CSS
   */

   constructor (props) {
      super (props);
      this.click = this.click.bind (this);
   }

   click (e) {
      e.preventDefault();
      this.props.projectClick (this.props.project);
   }

   render() {
      return (
         <p className="project-card" onClick={this.click}>{this.props.project.getTitle()}</p>
      );
   }
}

// Shows item textbox and title, options when hovered, details when selected
class ItemCard extends React.Component {
   /* TODO
      - Finalize CSS
   */

   constructor (props) {
      super (props);
      this.state = {
         expanded: false,
         floatingMenu: null
      };
      this.toggleExpanded = this.toggleExpanded.bind (this);
      this.itemEdit = this.itemEdit.bind (this);
      this.itemDelete = this.itemDelete.bind (this);
      this.closeFloatingMenu = this.closeFloatingMenu.bind (this);
      this.deleteItem = this.deleteItem.bind (this);
   }

   toggleExpanded() {
      this.setState ({expanded: !this.state.expanded});
   }

   itemEdit() {
      this.setState ({floatingMenu: "itemEdit"});
   }

   itemDelete() {
      this.setState ({floatingMenu: "itemDelete"});
   }

   closeFloatingMenu() {
      this.setState ({floatingMenu: null});
   }

   deleteItem() {
      appManager.removeItemFromProject (this.props.item.getID(), this.props.item.getParentProject());
      this.props.refresh();
   }

   render() {
      // Whether the card is expanded to show detailed information
      const infoClass = this.state.expanded ? "item-info-expanded" : "item-info-collapsed";

      // Priority
      let priorityText = "";
      switch (this.props.item.getPriority()) {
         default:
            priorityText = "Undefined";
            break;
         case "0":
            priorityText = "Low";
            break;
         case "1":
            priorityText = "Moderate";
            break;
         case "2":
            priorityText = "High";
            break;
      }

      // Floating menus
      let floatingMenu = null;
      switch (this.state.floatingMenu) {
         default:
            break;
         case "itemEdit":
            floatingMenu = <ItemEditForm item={this.props.item} onEdit={this.closeFloatingMenu} onCancel={this.closeFloatingMenu} />;
            break;
         case "itemDelete":
            floatingMenu = <ConfirmationPrompt prompt={"Are you sure you want to delete item '" + this.props.item.getTitle() + "'? (There is no undo)"} onAccept={this.deleteItem} onCancel={this.closeFloatingMenu} />;
            break;
      }

      return (
         <div className="item-card" onClick={this.toggleExpanded}>
            <span>{this.props.item.getTitle()}</span>
            <div className="options-menu">
               <span className="stay-right">&#8942;</span>
               <div className="options-menu-items">
                  <span onClick={this.itemEdit}>Edit item</span>
                  <span onClick={this.itemDelete}>Delete item</span>
               </div>
            </div>
            <ul className={infoClass}>
               <li>
                  <span className="item-info-label">Description: </span>
                  {this.props.item.getDescription()}
               </li>
               <li>
                  <span className="item-info-label">Due date: </span>
                  {this.props.item.getDueDate()}
               </li>
               <li>
                  <span className="item-info-label">Priority: </span>
                  {priorityText}
               </li>
            </ul>
            {(floatingMenu !== null) && floatingMenu}
         </div>
      );
   }
}

// Shows form to create a project
class ProjectForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {newTitle: ""};
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.createProject = this.createProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   createProject() {
      appManager.addProject (this.state.newTitle);
      this.props.onCreate();
   }

   render() {
      return (
         <div id="newProjectForm" className="form">
            <h3>New Project</h3>
            <p>
               <label htmlFor="newProjectTitle">Title:</label>
               <input id="newProjectTitle" type="text" placeholder="New Project" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <button onClick={this.createProject}>Create</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows form to create an item
class ItemForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         newTitle: "",
         newDescription: "",
         newDueDate: "",
         newPriority: "",
      };
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.handleDescriptionChange = this.handleDescriptionChange.bind (this);
      this.handleDueDateChange = this.handleDueDateChange.bind (this);
      this.handlePriorityChange = this.handlePriorityChange.bind (this);
      this.createItem = this.createItem.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   handleDescriptionChange (evt) {
      this.setState ({newDescription: evt.target.value});
   }

   handleDueDateChange (evt) {
      this.setState ({newDueDate: evt.target.value});
   }

   handlePriorityChange (evt) {
      this.setState ({newPriority: evt.target.value});
   }

   createItem() {
      appManager.addItem (this.props.projectID, this.state.newTitle, this.state.newDescription, this.state.newDueDate, this.state.newPriority);
      this.props.onCreate();
   }

   render() {
      return (
         <div id="newItemForm" className="form">
            <h3>New TODO Item</h3>
            <p>
               <label htmlFor="newItemTitle">Title:</label>
               <input id="newItemTitle" type="text" placeholder="New TODO Item" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <p>
               <label htmlFor="newItemDescription">Description:</label>
               <input id="newItemDescription" type="text" value={this.state.newDescription} onChange={this.handleDescriptionChange} />
            </p>
            <p>
               <label htmlFor="newItemDueDate">Due Date:</label>
               <input id="newItemDueDate" type="date" value={this.state.newDueDate} onChange={this.handleDueDateChange} />
            </p>
            <p>
               <label htmlFor="newItemPriority">Priority:</label>
               <select id="newItemPriority" value={this.state.newPriority} onChange={this.handlePriorityChange}>
                  <option value="0">Low</option>
                  <option value="1">Moderate</option>
                  <option value="2">High</option>
               </select>
            </p>
            <button onClick={this.createItem}>Create</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows form to edit a project
class ProjectEditForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {newTitle: this.props.project.getTitle()};
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.editProject = this.editProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   editProject() {
      this.props.project.setTitle (this.state.newTitle);
      this.props.onEdit();
   }

   render() {
      return (
         <div id="projectEditForm" className="form">
            <h3>Edit '{this.props.project.getTitle()}'</h3>
            <p>
               <label htmlFor="newProjectTitle">Title:</label>
               <input id="newProjectTitle" type="text" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <button onClick={this.editProject}>Edit</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows floating confirmation menu with customizable text
class ConfirmationPrompt extends React.Component {

   render() {
      return (
         <div className="confirmation-prompt">
            <p>{this.props.prompt}</p>
            <button onClick={this.props.onAccept}>Accept</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows form to edit an item
class ItemEditForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         newTitle: this.props.item.getTitle(),
         newDescription: this.props.item.getDescription(),
         newDueDate: this.props.item.getDueDate(),
         newPriority: this.props.item.getPriority()
      };
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.handleDescriptionChange = this.handleDescriptionChange.bind (this);
      this.handleDueDateChange = this.handleDueDateChange.bind (this);
      this.handlePriorityChange = this.handlePriorityChange.bind (this);
      this.editItem = this.editItem.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   handleDescriptionChange (evt) {
      this.setState ({newDescription: evt.target.value});
   }

   handleDueDateChange (evt) {
      this.setState ({newDueDate: evt.target.value});
   }

   handlePriorityChange (evt) {
      this.setState ({newPriority: evt.target.value});
   }

   editItem() {
      this.props.item.setTitle (this.state.newTitle);
      this.props.item.setDescription (this.state.newDescription);
      this.props.item.setDueDate (this.state.newDueDate);
      this.props.item.setPriority (this.state.newPriority);
      this.props.onEdit();
   }

   render() {
      return (
         <div id="itemEditForm" className="form">
            <h3>Edit '{this.props.item.getTitle()}' Item</h3>
            <p>
               <label htmlFor="newItemTitle">Title:</label>
               <input id="newItemTitle" type="text" placeholder="New TODO Item" value={this.state.newTitle} onChange={this.handleTitleChange} />
            </p>
            <p>
               <label htmlFor="newItemDescription">Description:</label>
               <input id="newItemDescription" type="text" value={this.state.newDescription} onChange={this.handleDescriptionChange} />
            </p>
            <p>
               <label htmlFor="newItemDueDate">Due Date:</label>
               <input id="newItemDueDate" type="date" value={this.state.newDueDate} onChange={this.handleDueDateChange} />
            </p>
            <p>
               <label htmlFor="newItemPriority">Priority:</label>
               <select id="newItemPriority" value={this.state.newPriority} onChange={this.handlePriorityChange}>
                  <option value="0">Low</option>
                  <option value="1">Moderate</option>
                  <option value="2">High</option>
               </select>
            </p>
            <button onClick={this.editItem}>Save</button>
            <button onClick={this.props.onCancel}>Cancel</button>
         </div>
      );
   }
}

// Shows a list of all items in all projects
class AllItemsView extends React.Component {

   constructor (props) {
      super (props);
      this.state = {refresh: 0};
      this.linkBackClick = this.linkBackClick.bind (this);
      this.refreshView = this.refreshView.bind (this);
   }

   linkBackClick() {
      this.props.linkBack();
   }

   refreshView() {
      this.setState ({refresh: 1});
   }

   render() {

      // Create list of TODO items to show
      const items = [];
      for (let i = 0; i < appManager.getNumProjects(); i++) {
         let currentProject = appManager.getProjectByIndex (i);
         let currentItems = appManager.getItemListFromProject (currentProject.getID());
         for (let j = 0; j < currentItems.length; j++) {
            items.push (currentItems[j]);
         }
      }
      const listItems = items.map (function (item) {
         return <ItemCard item={item} key={item.getID()} refresh={this.refreshView} />;
      }, this);

      return (
         <>
            <h3 className="link-to-projects" onClick={this.linkBackClick}>&lt; Projects</h3>
            <h2>All Items</h2>
            {listItems}
         </>
      );
   }
}

// Export main component to be used in main.js
export default App;