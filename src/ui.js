// Import React library for creating components
import React from 'react';

// Import our TODO API thingy
import {AppManager} from "./todo";

// Use the functionality from custom TODO library
var appManager = new AppManager();

// Renders the web app (back to root node)
class App extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         view: "mainView",
         sortMethod: "creationUp",
         theme: 0,
         showCompletionStatus: false
      };
      this.updateView = this.updateView.bind (this);
      this.enterMainView = this.enterMainView.bind (this);
      this.changeTheme = this.changeTheme.bind (this);
      this.saveAppData = this.saveAppData.bind (this);
      this.updateCompletionStatusVisibility = this.updateCompletionStatusVisibility.bind (this);
      this.updateSortMethod = this.updateSortMethod.bind (this);
   }

   componentDidMount() {
      let settings = appManager.loadAppData();
      this.setState ({
         sortMethod: settings.sortMethod === null ? "creationUp" : settings.sortMethod,
         theme: settings.theme === null ? 0 : settings.theme,
         showCompletionStatus: settings.showCompletionStatus === null ? false : settings.showCompletionStatus
      });
      appManager.loadTheme (settings.theme);
   }

   updateView (view) {
      this.setState ({view: view});
   }

   enterMainView() {
      this.updateView ("mainView");
   }

   changeTheme (newTheme) {
      this.setState ({theme: newTheme});
      appManager.loadTheme (newTheme);
      this.saveAppData ({theme: newTheme});
   }

   saveAppData (items) {

      // List of changes to save
      let itemsToSave = {};

      // Modified items
      let projectData = items.projectData;
      let sortMethod = items.sortMethod;
      let theme = items.theme;
      let showCompletionStatus = items.showCompletionStatus;

      // Parse possible modified items

      if (projectData) {
         itemsToSave.projectData = true;
      }

      if (sortMethod) {
         this.setState ({sortMethod: sortMethod});
         itemsToSave.sortMethod = sortMethod;
      }

      if (theme) {
         this.setState ({theme: theme});
         itemsToSave.theme = theme;
      }

      if (showCompletionStatus !== undefined) {
         this.setState ({showCompletionStatus: showCompletionStatus});
         itemsToSave.showCompletionStatus = showCompletionStatus;
      }

      // Request save changes
      appManager.saveAppData (itemsToSave);
   }

   updateCompletionStatusVisibility (csv) {
      this.setState ({showCompletionStatus: csv});
      this.saveAppData ({showCompletionStatus: csv});
   }

   updateSortMethod (sort) {
      this.setState ({sortMethod: sort});
      this.saveAppData ({projectData: true, sortMethod: sort});
   }

   render () {
      return (
         <>
            <AppHeader toMainView={this.enterMainView} completionStatusVisibility={this.state.showCompletionStatus} updateCompletionStatusVisibility={this.updateCompletionStatusVisibility} changeTheme={this.changeTheme} theme={this.state.theme} />
            <AppContent view={this.state.view} updateView={this.updateView} completionStatusVisibility={this.state.showCompletionStatus} save={this.saveAppData} updateCompletionStatusVisibility={this.updateCompletionStatusVisibility} sortMethod={this.state.sortMethod} updateSortMethod={this.updateSortMethod} />
            <AppFooter />
         </>
      );
  }
}

// Web app title and settings
class AppHeader extends React.Component {

   render() {
      return(
         <div className="app-header">
            <h1>Simple TODO<SettingsMenu theme={this.props.theme} changeTheme={this.props.changeTheme} completionStatusVisibility={this.props.completionStatusVisibility} updateCompletionStatusVisibility={this.props.updateCompletionStatusVisibility} refresh={this.props.toMainView} /></h1>
         </div>
      );
   }
}

// Body of the web app
class AppContent extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         project: null
      };
      this.enterProject = this.enterProject.bind (this);
      this.enterMainView = this.enterMainView.bind (this);
      this.enterAllItemsView = this.enterAllItemsView.bind (this);
   }

   enterProject (targetProject) {
      this.props.updateView ("projectView");
      this.setState ({project: targetProject});
   }

   enterMainView() {
      this.props.updateView ("mainView");
      this.setState ({project: null});
   }

   enterAllItemsView() {
      this.props.updateView ("allItemsView");
      this.setState ({project: null});
   }

   render() {
      return (
         <div className="app-content">
            {this.props.view === "mainView" &&
               <MainView projectClick={this.enterProject} allItemsClick={this.enterAllItemsView} />
            }
            {this.props.view === "projectView" &&
               <ProjectView project={this.state.project} linkBack={this.enterMainView} sortMethod={this.props.sortMethod} updateSortMethod={this.props.updateSortMethod} completionStatusVisibility={this.props.completionStatusVisibility} />
            }
            {this.props.view === "allItemsView" &&
               <AllItemsView linkBack={this.enterMainView} sortMethod={this.props.sortMethod} updateSortMethod={this.props.updateSortMethod} />
            }
         </div>
      );
   }
}

// Footer of the web app (basic info about... idk)
class AppFooter extends React.Component {

   render() {
      return (
         <div className="app-footer">
            <span>Made by <b>David Valenzuela González</b>, see the source code <a href="https://github.com/david4jsus/Simple-TODO">here!</a></span>
         </div>
      );
   }
}

// List of projects, opening view when opening app
class MainView extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         projectForm: false
      };
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
            <h2>Projects<span className="stay-right"><span className="button" onClick={this.openProjectForm}>+</span> | <span className="button" onClick={this.props.allItemsClick}>All items</span></span></h2>
            {listProjects}
            {this.state.projectForm && <ProjectForm onCreate={this.closeProjectForm} onCancel={this.closeProjectForm} />}
         </>
      );
   }
}

// List of items in a specific project
class ProjectView extends React.Component {

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
      appManager.saveAppData ({projectData: true});
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
               {this.props.project.getTitle()} {this.props.completionStatusVisibility && "(" + this.props.project.getCompletionStatus() + ")"}
               <span className="stay-right">
                  <SortSelect sortMethod={this.props.sortMethod} updateSortMethod={this.props.updateSortMethod} />
                  &nbsp;|&nbsp;
                  <span className="button" onClick={this.openItemForm}>+</span>
                  &nbsp;|&nbsp;
                  <div className="options-menu">
                     <span className="button">&#8942;</span>
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

   constructor (props) {
      super (props);
      this.state = {
         expanded: false,
         floatingMenu: null,
         checked: props.item.getIsCompleted()
      };
      this.toggleExpanded = this.toggleExpanded.bind (this);
      this.itemEdit = this.itemEdit.bind (this);
      this.itemDelete = this.itemDelete.bind (this);
      this.closeFloatingMenu = this.closeFloatingMenu.bind (this);
      this.deleteItem = this.deleteItem.bind (this);
      this.toggleCompletion = this.toggleCompletion.bind (this);
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
      appManager.saveAppData ({projectData: true});
      this.props.refresh();
   }

   toggleCompletion() {
      this.props.item.toggleCompletedStatus();
      this.setState ({checked: this.props.item.getIsCompleted()});
      appManager.saveAppData ({projectData: true});
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
            <span><input type="checkbox" checked={this.state.checked} onChange={this.toggleCompletion} onClick={(e) => e.stopPropagation()} />{this.props.item.getTitle()}</span>
            <div className="options-menu">
               <span className="stay-right">&#8942;</span>
               <div className="options-menu-items">
                  <span onClick={(e) => {e.stopPropagation(); this.itemEdit()}}>Edit item</span>
                  <span onClick={(e) => {e.stopPropagation(); this.itemDelete()}}>Delete item</span>
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
      this.state = {
         newTitle: ""
      };
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.createProject = this.createProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   createProject() {
      appManager.addProject (this.state.newTitle);
      appManager.saveAppData ({projectData: true});
      this.props.onCreate();
   }

   render() {
      return (
         <>
            <div className="back-pane"></div>
            <div id="newProjectForm" className="form">
               <h3>New Project</h3>
               <p>
                  <label htmlFor="newProjectTitle">Title:</label>
                  <input id="newProjectTitle" type="text" placeholder="New Project" value={this.state.newTitle} onChange={this.handleTitleChange} />
               </p>
               <button onClick={this.createProject}>Create</button>
               <button onClick={this.props.onCancel}>Cancel</button>
            </div>
         </>
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
      appManager.saveAppData ({projectData: true});
      this.props.onCreate();
   }

   render() {
      return (
         <>
            <div className="back-pane"></div>
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
         </>
      );
   }
}

// Shows form to edit a project
class ProjectEditForm extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         newTitle: this.props.project.getTitle()
      };
      this.handleTitleChange = this.handleTitleChange.bind (this);
      this.editProject = this.editProject.bind (this);
   }

   handleTitleChange (evt) {
      this.setState ({newTitle: evt.target.value});
   }

   editProject() {
      this.props.project.setTitle (this.state.newTitle);
      appManager.saveAppData ({projectData: true});
      this.props.onEdit();
   }

   render() {
      return (
         <>
            <div className="back-pane"></div>
            <div id="projectEditForm" className="form">
               <h3>Edit '{this.props.project.getTitle()}'</h3>
               <p>
                  <label htmlFor="newProjectTitle">Title:</label>
                  <input id="newProjectTitle" type="text" value={this.state.newTitle} onChange={this.handleTitleChange} />
               </p>
               <button onClick={this.editProject}>Edit</button>
               <button onClick={this.props.onCancel}>Cancel</button>
            </div>
         </>
      );
   }
}

// Shows floating confirmation menu with customizable text
class ConfirmationPrompt extends React.Component {

   render() {
      return (
         <>
            <div className="back-pane" onClick={(e) => e.stopPropagation()}></div>
            <div className="confirmation-prompt" onClick={(e) => e.stopPropagation()}>
               <p>{this.props.prompt}</p>
               <button onClick={this.props.onAccept}>Accept</button>
               <button onClick={this.props.onCancel}>Cancel</button>
            </div>
         </>
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
      appManager.saveAppData ({projectData: true});
      this.props.onEdit();
   }

   render() {
      return (
         <>
            <div className="back-pane" onClick={(e) => e.stopPropagation()}></div>
            <div id="itemEditForm" className="form" onClick={(e) => e.stopPropagation()}>
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
         </>
      );
   }
}

// Shows a list of all items in all projects
class AllItemsView extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         refresh: 0
      };
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
            <h2>All Items <span className="stay-right"><SortSelect sortMethod={this.props.sortMethod} updateSortMethod={this.props.updateSortMethod} /></span></h2>
            {listItems}
         </>
      );
   }
}

// Allow sorting of items in a page based on different criteria
class SortSelect extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         sort: props.sortMethod
      };
      this.handleSortChange = this.handleSortChange.bind (this);
   }

   handleSortChange (evt) {
      let sortMethod = evt.target.value;
      this.setState ({sort: sortMethod});
      appManager.changeSortMethod (sortMethod);
      this.props.updateSortMethod (sortMethod);
   }

   render() {
      return (
         <span>
            Sort by <select className="sort-select" value={this.state.sort} onChange={this.handleSortChange}>
               <option value="creationUp">order of creation &uarr;</option>
               <option value="creationDown">order of creation &darr;</option>
               <option value="priorityUp">item priority &uarr;</option>
               <option value="priorityDown">item priority &darr;</option>
               <option value="dueDateUp">due date &uarr;</option>
               <option value="dueDateDown">due date &darr;</option>
            </select>
         </span>
      );
   }
}

// Settings menu
class SettingsMenu extends React.Component {

   constructor (props) {
      super (props);
      this.state = {
         menuOpen: false,
         eraseDataPrompt: false
      };
      this.toggleMenu = this.toggleMenu.bind (this);
      this.changeTheme = this.changeTheme.bind (this);
      this.toggleCompletionStatusVisibility = this.toggleCompletionStatusVisibility.bind (this);
      this.openEraseDataPrompt = this.openEraseDataPrompt.bind (this);
      this.closeEraseDataPrompt = this.closeEraseDataPrompt.bind (this);
      this.eraseData = this.eraseData.bind (this);
   }

   toggleMenu() {
      this.setState ({menuOpen: !this.state.menuOpen});
   }

   changeTheme (evt) {
      this.props.changeTheme (parseInt(evt.target.value));
   }

   toggleCompletionStatusVisibility() {
      this.props.updateCompletionStatusVisibility (!this.props.completionStatusVisibility);
   }

   openEraseDataPrompt() {
      this.setState ({eraseDataPrompt: true});
   }

   closeEraseDataPrompt() {
      this.setState ({eraseDataPrompt: false});
   }

   eraseData() {
      appManager.eraseProjectData();
      appManager.saveAppData ({projectData: true});
      this.closeEraseDataPrompt();
      this.props.refresh();
   }

   render() {

      // Whether the menu is open
      let menuOpen = this.state.menuOpen ? {right: "0"} : {right: "-480px"};

      return (
         <>
            {this.state.menuOpen && <div className="back-pane" onClick={this.toggleMenu}></div>}
            <span className="settings-button" onClick={this.toggleMenu}>&#9776;</span>
            <div className="settings-menu" style={menuOpen}>
               <h4>Settings <span className="settings-button" onClick={this.toggleMenu}>X</span></h4>
               <p>
                  <label htmlFor="settingsTheme">Theme:</label>
                  <select id="settingsTheme" onChange={this.changeTheme} value={this.props.theme}>
                     <option value={0}>Clean</option>
                     <option value={1}>Orchid</option>
                     <option value={2}>Grey Alabaster</option>
                     <option value={3}>Blue Orange</option>
                     <option value={4}>Dodger</option>
                     <option value={5}>Rainy</option>
                  </select>
               </p>
               <p>
                  <label htmlFor="settingsCompletion">Show completion status (percentage) for projects:</label>
                  <input id="settingsCompletion" type="checkbox" checked={this.props.completionStatusVisibility} onChange={this.toggleCompletionStatusVisibility} />
               </p>
               <button onClick={this.openEraseDataPrompt}>Erase all project data</button>
               {this.state.eraseDataPrompt && <ConfirmationPrompt prompt="Are you sure you want to delete all project data? (There is no undo)" onAccept={this.eraseData} onCancel={this.closeEraseDataPrompt} />}
            </div>
         </>
      );
   }
}

// Export main component to be used in main.js
export default App;