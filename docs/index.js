import "./styles.css"
import chevUp from "./chevronUp.svg";
import chevDown from "./chevronDown.svg";
import listBox from "./list-box-outline.svg";
import editImg from "./edit.svg";
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

let currentProjectIndex = 0;

const leftContainer = document.getElementById("left_container");
const rightContainer = document.getElementById("right_container");

let bottomWidthList = [];

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
    makeProjectDOM(projectGlobal[0],rightContainer);
}



// const clearButton = document.createElement("button");
// clearButton.textContent = "clear";

const bodyGlobal = document.getElementById("body");

function createPopUp(button){
    button.addEventListener("click", () => {
        const popUp = document.createElement("div");
        const background = document.createElement("div");
    
        popUp.setAttribute("id", "popUp");
        background.setAttribute("id", "shadowBackground");
         
        popUp.style.display = "flex";
        background.style.display = "flex"
        
        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
    
        popUp.appendChild(closeButton);
        bodyGlobal.appendChild(background);
        bodyGlobal.appendChild(popUp);
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

    const buttonAndText = document.createElement("div");
    buttonAndText.classList.add("buttonAndText");
    buttonAndText.appendChild(button);
    buttonAndText.appendChild(textDiv);

    topDiv.appendChild(buttonAndText);
    topDiv.appendChild(expandButton);

    container.appendChild(topDiv);


    button.addEventListener("click", () => {
        console.log(`newProject length: ${project.projectList.length}`);
        button.classList.toggle("taskButtonNormal");
        button.classList.toggle("taskButtonPressed");
        const taskIndex = button.getAttribute("id");
        project.projectList.splice(taskIndex, 1);
        localStorage.setItem("projects", JSON.stringify([project]));
        console.log(`taskIndex: ${taskIndex}`);

        setTimeout(() => deleteTaskDOM(container), 400); 

    })


    expandButton.addEventListener("click", () => {
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


    projImg.src = listBox;

    projTextDiv.textContent = project.name;

    iconAndTextDiv.appendChild(projImg);
    iconAndTextDiv.appendChild(projTextDiv);

    singleProject.classList.add("singleProject");

    singleProject.appendChild(iconAndTextDiv);
    
    if(currentProjectIndex == 0 && index == 0){
        projectsDiv.style.backgroundColor = "rgba(240, 113, 113, 0.5)";
        const editButton = document.createElement("img");
        editButton.src = editImg;
        editButton.classList.add("projEditButton");
        createPopUp(editButton);
    
        singleProject.appendChild(editButton);
    }

    projectsDiv.appendChild(singleProject);
    leftContainer.appendChild(projectsDiv);

    projectsDiv.addEventListener("click", () => {
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
            createPopUp(editButton);
        
            singleProject.appendChild(editButton);

            rightContainer.replaceChildren();

            console.log(`project[index]: ${projectGlobal[index]}`);

            makeProjectDOM(newProjGlobal[index],rightContainer);
            currentProjectIndex = index;

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

