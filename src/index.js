import "./styles.css"
import chevUp from "./chevronUp.svg";
import chevDown from "./chevronDown.svg";
import listBox from "./list-box-outline.svg";
import editImg from "./edit.svg";
import editTaskImg from "./pencil.svg";
import { format, addDays} from 'date-fns';

const singleTask = {
    title: "New Task",
    description: "",
    dueDate: "",
    priority: "",
    titleLength: "",
    descLength: "",
}

const singleProject = {
    name: "Default Project",
    projectList: [],
    color: "",
}
let currentProjectIndex;

if(localStorage.getItem("currentProjectIndex")){
    let currentProjectIndex = localStorage.getItem("currentProjectIndex");

}

else{
    let currentProjectIndex = 0;
}

const leftContainer = document.getElementById("left_container");
const rightContainer = document.getElementById("right_container");

let bottomWidthList = [];
console.log("first");
if(localStorage.length <= 1){
    const project = newProject();
    const projectGlobal = [project];
    console.log(`secondpro length: ${project.projectList.length}`);
    localStorage.setItem("projects", JSON.stringify([project]));
    console.log(`projects first here: ${localStorage.getItem("projects")}`);
    makeLeftDOM(leftContainer, projectGlobal);
    
    makeProjectDOM(projectGlobal[0], rightContainer);
}

else{
    const projectGlobal = JSON.parse(localStorage.getItem("projects"));

    console.log(`projects second here: ${localStorage.getItem("projects")}`);

    console.log(`.title: ${projectGlobal}`);
    makeLeftDOM(leftContainer, projectGlobal);
    let currentProjectIndex = localStorage.getItem("currentProjectIndex");
    makeProjectDOM(projectGlobal[currentProjectIndex],rightContainer);
}



// const clearButton = document.createElement("button");
// clearButton.textContent = "clear";

const bodyGlobal = document.getElementById("body");

function createPopUp(button, option){
    button.addEventListener("click", () => {
        const projectGlobal = JSON.parse(localStorage.getItem("projects"));
        const popUp = document.createElement("div");
        const background = document.createElement("div");
        const currentProjectIndex = localStorage.getItem("currentProjectIndex");
        popUp.setAttribute("id", "popUp");
        background.setAttribute("id", "shadowBackground");
         
        popUp.style.display = "grid";
        background.style.display = "flex"
        if(option == 1){
            console.log("option 1");
            
            const inputDiv = document.createElement("div");
            const nameDiv = document.createElement("div");
            const colorDiv = document.createElement("div");
            colorDiv.classList.add("colorDiv");
            const colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.id = "colorInput";
           
            
            colorDiv.appendChild(colorInput);

            nameDiv.classList.add("nameDiv");
            nameDiv.textContent = "Name"
            inputDiv.classList.add("inputDiv");
            
            const nameInput = document.createElement("input");
            nameInput.id = "nameInput";
            nameInput.value = projectGlobal[currentProjectIndex].name;

            inputDiv.appendChild(nameDiv);
            inputDiv.appendChild(nameInput);
        
            popUp.appendChild(inputDiv);
            popUp.appendChild(colorDiv);
        }
       else if(option == 2){
            console.log("option 2");
                
            const selectDiv = document.createElement("div");
            selectDiv.classList.add("selectDiv");

            const dateDiv = document.createElement("div");
            dateDiv.classList.add("dateDiv");

            const dateText = document.createElement("h3");
            dateText.textContent = "Date";

            const selectText = document.createElement("h3");
            selectText.textContent = "Priority";

            

            const dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.id = "dateInput";

            
            const selectInput = document.createElement("select");
            selectInput.id = "select";
            

            const selectionOptions = [
                {value: "Low", text: "Low"},
                {value: "Medium", text: "Medium"},
                {value: "High", text: "High"},
                
            ]
            
            selectionOptions.forEach(optionData => {
                const option = document.createElement("option");
                option.value = optionData.value;
                option.text = optionData.text;

                selectInput.appendChild(option);
            })

            dateDiv.appendChild(dateInput);

            
    
            dateDiv.appendChild(dateText);
            dateDiv.appendChild(dateInput);
            
            selectDiv.appendChild(selectText);
            selectDiv.appendChild(selectInput);
            
            popUp.appendChild(dateDiv);
            popUp.appendChild(selectDiv);
        }

        const popButtonsDiv = document.createElement("div");
        const saveButton = document.createElement("button");
        const closeButton = document.createElement("button");
        saveButton.textContent = "Save";
        closeButton.textContent = "Close";
        saveButton.classList.add("savePopUp");
        closeButton.classList.add("closePopUp");
        popButtonsDiv.classList.add("popButtonsDiv");
        popButtonsDiv.appendChild(saveButton);
        popButtonsDiv.appendChild(closeButton);
        popUp.appendChild(popButtonsDiv);
    
        bodyGlobal.appendChild(background);
        bodyGlobal.appendChild(popUp);

        saveButton.addEventListener("click", () => {

            if(option == 1){
                const newColor = document.getElementById("colorInput");
                if (newColor.value != projectGlobal[currentProjectIndex].color){
                    projectGlobal[currentProjectIndex].color = newColor.value;
                    localStorage.setItem("projects", JSON.stringify(projectGlobal));
                    

                    leftContainer.replaceChildren();
                    leftContainer.nextElementSibling.remove();
                    makeLeftDOM(leftContainer, JSON.parse(localStorage.getItem("projects")));
                    console.log(`color: ${newColor.value}`);
                }

                const nameInput = document.getElementById("nameInput")
                if(nameInput.value != projectGlobal[currentProjectIndex].name){
                    projectGlobal[currentProjectIndex].name = nameInput.value;
                    localStorage.setItem("projects", JSON.stringify(projectGlobal));

                    leftContainer.replaceChildren();
                    leftContainer.nextElementSibling.remove();
                    makeLeftDOM(leftContainer, JSON.parse(localStorage.getItem("projects")));
                    rightContainer.replaceChildren();
                    makeProjectDOM(projectGlobal[currentProjectIndex], rightContainer);

            }
            }

            else{
                const dateInput = document.getElementById("dateInput");
                const prioritySelection = document.getElementById("select");
                
                const currentTaskIndex = button.id;

                projectGlobal[currentProjectIndex].projectList[currentTaskIndex].dueDate = dateInput.value;
                projectGlobal[currentProjectIndex].projectList[currentTaskIndex].priority = prioritySelection.value;

                localStorage.setItem("projects", JSON.stringify(projectGlobal));
                rightContainer.replaceChildren();
                makeProjectDOM(projectGlobal[currentProjectIndex], rightContainer);
            }
            

            popUp.remove();
            background.remove();

        })

        closeButton.addEventListener("click", () => {
            popUp.remove();
            background.remove();
            
        })
        
    })
    
}






function makeTextInput(task, index){
    const textInput = document.createElement("input");
    textInput.id = "textInput";
    textInput.type = "text";
    textInput.value = task.title;
    textInput.placeholder = "Type Task Here";

    if(task.titleLength != ""){
        textInput.style.width = task.titleLength;
    }

    textInput.addEventListener("input", () => {
        const currentProjectIndex = localStorage.getItem("currentProjectIndex");

        const newLength = Math.min(textInput.scrollWidth, textInput.parentElement.parentElement.clientWidth - 100) + "px"
        textInput.style.width = newLength;


        const globalProj = JSON.parse(localStorage.getItem("projects"));

        console.log(`index: ${index}`);

        console.log(`globalProj[currentProjectIndex]: ${globalProj[currentProjectIndex].projectList[index]}`)
        globalProj[currentProjectIndex].projectList[index].title = textInput.value;
        globalProj[currentProjectIndex].projectList[index].titleLength = newLength;
        localStorage.setItem("projects", JSON.stringify(globalProj));
        
    })

    return textInput;
}

function makeBottomTextInput(task, index){
    const bottomTextInput = document.createElement("input");
    bottomTextInput.id = "bottomInput";
    bottomTextInput.type = "bottomText";
    bottomTextInput.value = task.description;
    bottomTextInput.placeholder = "Type Description Here";

    if(task.descLength != ""){
        bottomTextInput.style.width = task.descLength;
    }

    bottomTextInput.addEventListener("input", () => {
        const currentProjectIndex = localStorage.getItem("currentProjectIndex");
        const newLength = Math.min(bottomTextInput.scrollWidth, bottomTextInput.parentElement.parentElement.clientWidth - 100) + "px"
        bottomTextInput.style.width = newLength;
        
        const globalProj = JSON.parse(localStorage.getItem("projects"));

        console.log(`index: ${index}`);

        console.log(`globalProj[currentProjectIndex]: ${globalProj[currentProjectIndex].projectList[index]}`)
        globalProj[currentProjectIndex].projectList[index].description = bottomTextInput.value;
        globalProj[currentProjectIndex].projectList[index].descLength = newLength;

        localStorage.setItem("projects", JSON.stringify(globalProj));
        
    })
    
    return bottomTextInput;
}



function makeSingleTask(task, container, index, project){



    let bottomDivPressed = false;
    const topDiv = document.createElement("div");
    topDiv.classList.add("topDiv");
    const button = document.createElement("button");
    button.classList.add("taskButtonNormal");
    button.setAttribute("id", index);

    const textDiv = document.createElement("div");
    textDiv.classList.add("textDiv");


    const textInput = makeTextInput(task, index);

    
    textDiv.appendChild(textInput)

    const expandButton = document.createElement("img");
    expandButton.classList.add("expandButton");
    let up = true;
    expandButton.src = chevUp;
    
    const allText = document.createElement("div");
    allText.classList.add("allText");
    

    const buttonAndText = document.createElement("div");
    buttonAndText.classList.add("buttonAndText");
    buttonAndText.appendChild(button);
    buttonAndText.appendChild(textDiv);

    const subText = document.createElement("div");
    subText.classList.add("subText");

    const dateText = document.createElement("div");
    const priorityText = document.createElement("div");
    
    if(task.dueDate != ""){
        dateText.innerHTML = task.dueDate;
        subText.appendChild(dateText);

    }
    
    if(task.priority != ""){
        priorityText.innerHTML = `${task.priority} Priority`;
        subText.appendChild(priorityText);
    }
    

    
    

    const editTaskButton = document.createElement("img");
    editTaskButton.src = editTaskImg;
    editTaskButton.id =  index;
    editTaskButton.classList.add("editTaskButton");

    createPopUp(editTaskButton, 2);

    allText.appendChild(buttonAndText);
    allText.appendChild(subText);

    topDiv.appendChild(allText);

    topDiv.appendChild(editTaskButton);
    topDiv.appendChild(expandButton);

    container.appendChild(topDiv);


    button.addEventListener("click", () => {
        const projectGlobal = JSON.parse(localStorage.getItem("projects"));
        const currentProjectIndex = JSON.parse(localStorage.getItem("currentProjectIndex"));
        console.log(`newProject length: ${project.projectList.length}`);
        button.classList.toggle("taskButtonNormal");
        button.classList.toggle("taskButtonPressed");
        const taskIndex = button.getAttribute("id");
        project.projectList.splice(taskIndex, 1);
        projectGlobal[currentProjectIndex] = project;

        localStorage.setItem("projects", JSON.stringify(projectGlobal));
        console.log(`taskIndex: ${taskIndex}`);

        setTimeout(() => deleteTaskDOM(container), 400); 

    })


    expandButton.addEventListener("click", () => {
        const currentProjectIndex = localStorage.getItem("currentProjectIndex");
        if(up == true){
            expandButton.src = chevDown;
            const bottomDiv = document.createElement("div");
            bottomDiv.setAttribute("id", "bottomDiv");
            const bottomText = makeBottomTextInput(task, index);

            bottomText.addEventListener("input", () => {
                const globalProj = JSON.parse(localStorage.getItem("projects"));

                console.log("hello bottom");

                
                globalProj[currentProjectIndex].projectList[index].description = bottomText.value;

                localStorage.setItem("projects", JSON.stringify(globalProj));
                bottomText.style.width = Math.min(bottomText.scrollWidth, bottomText.parentElement.clientWidth - 55) + "px";
                // bottomWidthList[index] = Math.min(bottomText.scrollWidth, bottomText.parentElement.clientWidth - 55) + "px";
                // localStorage.setItem("bottomWidth", JSON.stringify([bottomWidthList]));

            })

            bottomDiv.appendChild(bottomText);

            container.appendChild(bottomDiv);
            up = !up;
        }
        else{
            expandButton.src = chevUp;
            up = !up;
            

            topDiv.nextElementSibling.remove();

        }
    })

}

function deleteTaskDOM(container){
    container.remove();
}

function makeProjectDOM(project,container){
    const projectDiv = document.createElement("div");
    projectDiv.setAttribute("id", "projectDiv");
    
    const title = document.createElement("div");
    title.classList.add("projectTitle");
    title.textContent = project.name;
    projectDiv.appendChild(title)

    const allTasks = document.createElement("div");
    allTasks.setAttribute("id", "allTasks");
    
    for(let i = 0; i < project.projectList.length; i++){
      
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("taskDiv");
        console.log(`loopProject length: ${project.projectList.length}`);
        console.log(`i: ${i}`);
        makeSingleTask(project.projectList[i], taskDiv, i, project);
        allTasks.appendChild(taskDiv);
    }
    projectDiv.appendChild(allTasks);
    const addTaskDiv = document.createElement("div");
    addTaskDiv.classList.add("addTaskDiv");
    const addButton = document.createElement("button");
    addButton.setAttribute("id", "addButton");
    const buttonText = document.createElement("div");
    buttonText.textContent = "Add Task";

    addButton.textContent = "+";
    
    addTaskDiv.appendChild(addButton);
    addTaskDiv.appendChild(buttonText);

    addTaskDiv.addEventListener("click", () => {
        const currentProjectIndex = localStorage.getItem("currentProjectIndex");
        let task = {...singleTask, title: "New Task"};
        project.projectList.push(task);
        console.log(`project.projectList: ${project.projectList}`);
        let globalProj = JSON.parse(localStorage.getItem("projects"));
        globalProj[currentProjectIndex] = project; 

        localStorage.setItem("projects", JSON.stringify(globalProj));
        
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("taskDiv");
        makeSingleTask(task, taskDiv, project.projectList.length-1, project);
        allTasks.appendChild(taskDiv);
    })

    projectDiv.appendChild(addTaskDiv);

    container.appendChild(projectDiv);


    

}

function newProject(){
    const newTask = {...singleTask, title: "New Task"};

    const newProject ={...singleProject, projectList: [newTask]};

    return newProject;
}



function makeLeftDOM(leftContainer, project){
    

   
    makeProjectList(project);
    
    
    const addProjectDiv = makeAddProj(project);
    
    
}

function makeProjectList(projectGlobal){

    for(let index = 0; index < projectGlobal.length; index++){
        const project = projectGlobal[index];
        const projectsDiv = document.createElement("div");
        projectsDiv.classList.add("projectsDiv");
        projectsDiv.setAttribute("id", "projDiv" + index);



        const singleProject = document.createElement("div");
        const iconAndTextDiv = document.createElement("div");
        iconAndTextDiv.classList.add("iconAndTextDiv");
        const projTextDiv = document.createElement("div");
        
        const projImg = document.createElement("img");
        const projImgDiv = document.createElement("div");
        projImgDiv.appendChild(projImg);
        projImgDiv.setAttribute("id", `projImgDiv${index}`);
        projImgDiv.classList.add("projImgDiv");
        projImg.src = listBox;
        const listBoxLink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>list-box-outline</title><path d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z" /></svg>`
        const projImgDivW = document.getElementById(`projImgDiv${index}`)
        if(projectGlobal[index].color != "" && projImgDiv){
                projImgDiv.innerHTML = `<svg fill=${projectGlobal[index].color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>list-box-outline</title><path d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z" /></svg>`
                console.log("bruhhhh:");
            
        }
        projTextDiv.textContent = project.name;
        
        iconAndTextDiv.appendChild(projImgDiv);
        iconAndTextDiv.appendChild(projTextDiv);

        singleProject.classList.add("singleProject");

        singleProject.appendChild(iconAndTextDiv);
        
        if(JSON.parse(localStorage.getItem("currentProjectIndex")) == index){
            projectsDiv.style.backgroundColor = "rgba(240, 113, 113, 0.5)";
            const editButton = document.createElement("img");
            editButton.src = editImg;
            
            editButton.classList.add("projEditButton");
            createPopUp(editButton, 1);
        
            singleProject.appendChild(editButton);
        }

        projectsDiv.appendChild(singleProject);
        leftContainer.appendChild(projectsDiv);

        projectsDiv.addEventListener("click", () => {
            const currentProjectIndex = localStorage.getItem("currentProjectIndex");
            if(index != currentProjectIndex){

                const newProjGlobal = JSON.parse(localStorage.getItem("projects"));
                
                let oldIndex = currentProjectIndex;
                let oldDiv = document.getElementById(`projDiv${oldIndex}`);
                const newDiv = document.getElementById(`projDiv${index}`);
                const existingEditButton = oldDiv.querySelector(".projEditButton");

                if (existingEditButton) {
                    existingEditButton.remove();
                }
                console.log(`oldIndex: ${oldIndex}`);
                console.log(`newIndex: ${index}`);
                oldDiv.style.backgroundColor = "transparent";
                newDiv.style.backgroundColor = "rgba(240, 113, 113, 0.5)";
            
                const editButton = document.createElement("img");
                editButton.src = editImg;
                editButton.classList.add("projEditButton");
                
                createPopUp(editButton, 1);
            
                singleProject.appendChild(editButton);

                rightContainer.replaceChildren();

                console.log(`project[index]: ${projectGlobal[index]}`);

                makeProjectDOM(newProjGlobal[index],rightContainer);
                
                localStorage.setItem("currentProjectIndex", index);

            }
        })

    }

}

function makeAddProj(project){

    const leftSide = document.getElementById("left_side");
    const addProjectDiv = document.createElement("div");
    addProjectDiv.classList.add("addProjectDiv");

    const addProjectButton = document.createElement("button");
    addProjectButton.classList.add("addProjectButton");
    addProjectButton.textContent = "+";
    const addProjText = document.createElement("div");
    addProjText.textContent = "Add Project";
    addProjectDiv.appendChild(addProjectButton);       
    addProjectDiv.appendChild(addProjText);    

    leftSide.appendChild(addProjectDiv);

    addProjectDiv.addEventListener("click", () => {
        const newProj ={...singleProject, name: "New Project"};

        console.log(`newProj: ${newProj}`);
        
        project.push(newProj);
        console.log(`project: ${project}`);

        leftContainer.replaceChildren();

        makeProjectList(project);

        localStorage.setItem("projects", JSON.stringify(project));


    })

    return addProjectDiv;
}

