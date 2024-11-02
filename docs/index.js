import "./styles.css"
import chevUp from "./chevronUp.svg";
import chevDown from "./chevronDown.svg";
import listBox from "./list-box-outline.svg"
import { format, addDays} from 'date-fns';

const singleTask = {
    title: "New Task",
    description: "",
    dueDate: "",
    priority: "",
}

const singleProject = {
    name: "Default Project",
    projectList: [],
    color: "",
}
// class SingleTask{
    
//     constructor(title,description, dueDate, priority){
//         this.title = title;
//         this.description = description;
//         this.dueDate = dueDate;
//         this.priority = priority;

//         this.bottomWidth = 0;
//     }

//     // logTaskInfo(){
//     //     console.log(`Title: ${this.title} Description: ${this.description}
//     //          Due Date: ${this.dueDate} Priority: ${this.priority}`)


//     // }


// }

// class Project{
//     constructor(){
//         this.name = "Default Project"
//         this.projectList = [];
//         this.color = "blue";
//     }

//     getLength(){
//         return this.projectList.length;
//     }

    

// }

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



const clearButton = document.createElement("button");
clearButton.textContent = "clear";

clearButton.addEventListener("click", () => {
    localStorage.clear();
})


rightContainer.appendChild(clearButton)



function makeTextInput(title, index){
    const textInput = document.createElement("input");
    textInput.id = "textInput";
    textInput.type = "text";
    textInput.value = title;
    textInput.placeholder = "Type Task Here";

    textInput.addEventListener("input", () => {
        textInput.style.width = Math.min(textInput.scrollWidth, textInput.parentElement.parentElement.clientWidth - 100) + "px";
        
        const globalProj = JSON.parse(localStorage.getItem("projects"));

        console.log(`index: ${index}`);

        console.log(`globalProj[currentProjectIndex]: ${globalProj[currentProjectIndex].projectList[index]}`)
        globalProj[currentProjectIndex].projectList[index].title = textInput.value;

        localStorage.setItem("projects", JSON.stringify(globalProj));
        
    })

    return textInput;
}

function makeBottomTextInput(description, index){
    const bottomTextInput = document.createElement("input");
    bottomTextInput.id = "bottomInput";
    bottomTextInput.type = "bottomText";
    bottomTextInput.value = description;
    bottomTextInput.placeholder = "Type Description Here";


    bottomTextInput.addEventListener("input", () => {
        bottomTextInput.style.width = Math.min(bottomTextInput.scrollWidth, bottomTextInput.parentElement.parentElement.clientWidth - 100) + "px";
        
        const globalProj = JSON.parse(localStorage.getItem("projects"));

        console.log(`index: ${index}`);

        console.log(`globalProj[currentProjectIndex]: ${globalProj[currentProjectIndex].projectList[index]}`)
        globalProj[currentProjectIndex].projectList[index].description = bottomTextInput.value;

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


    const textInput = makeTextInput(task.title, index);

    
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
            const bottomText = makeBottomTextInput(task.description, index);
            
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
        console.log(`eventProject length: ${project.projectList.length}`);
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

    if(currentProjectIndex == 0 && index == 0){
        projectsDiv.style.backgroundColor = "rgba(240, 113, 113, 0.5)";
    }

    const singleProject = document.createElement("div");

    const projTextDiv = document.createElement("div");

    const projImg = document.createElement("img");

    projImg.src = listBox;

    projTextDiv.textContent = project.name;

    singleProject.classList.add("singleProject");

    singleProject.appendChild(projImg);
    singleProject.appendChild(projTextDiv);

    projectsDiv.appendChild(singleProject);
    leftContainer.appendChild(projectsDiv);

    projectsDiv.addEventListener("click", () => {
        if(index != currentProjectIndex){

            const newProjGlobal = JSON.parse(localStorage.getItem("projects"));
            
            let oldIndex = currentProjectIndex;
            let oldDiv = document.getElementById(`projDiv${oldIndex}`);
            const newDiv = document.getElementById(`projDiv${index}`);

            console.log(`oldIndex: ${oldIndex}`);
            console.log(`newIndex: ${index}`);
            oldDiv.style.backgroundColor = "transparent";
            newDiv.style.backgroundColor = "rgba(240, 113, 113, 0.5)";

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
        const newProj ={...singleProject};

        console.log(`newProj: ${newProj}`);
        
        project.push(newProj);
        console.log(`project: ${project}`);

        leftContainer.replaceChildren();

        makeProjectList(project);

        localStorage.setItem("projects", JSON.stringify(project));


    })

    return addProjectDiv;
}

