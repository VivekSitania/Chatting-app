const groupMembersBtn = document.getElementById("groupMembers");
const createGroupBtn = document.getElementById("createGroup");
const addToGroupBtn = document.getElementById("addToGroup");
const deleteFromGroupBtn = document.getElementById("deleteFromGroup");
const logoutBtn = document.getElementById("logout");
// const groups = document.getElementById("groups");

createGroupBtn.addEventListener("click", createGroup);

async function createGroup() {
    try {
        const groupName = prompt("Enter the Chat-Group Name");
        const members = [];
        let userInput;
        while (userInput !== "done") {
            userInput = prompt(`Enter the email Id of Users to Add! Please Enter Valid Email Id Otherwise User will not get Added. Type "done" when you are finished with entering user Email Id!`);
            if (userInput !== "done") {
                members.push(userInput);
            }
        }
        await axios.post("http://localhost:2500/group/createGroup",
            {
                groupName: groupName,
                members: members,
            }
        );
        console.log("check");
        alert(`${groupName} Created Successfully!`);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", getGroups);

async function getGroups() {
    try {
        const res = await axios.get("http://localhost:2500/group/getGroups");
        groups.innerHTML = "";
        res.data.groups.forEach((group) => {
            const li = document.createElement("li");
            const div1 = document.createElement("div");
            const div2 = document.createElement("div");
            const span = document.createElement("span");
            const p = document.createElement("p");

            div1.classList.add("d-flex", "bd-highlight");
            div2.className = "user_info";
            span.appendChild(document.createTextNode(group.name));
            p.appendChild(document.createTextNode(`${group.admin} is Admin`));

            div2.appendChild(span);
            div2.appendChild(p);

            div1.appendChild(div2);
            li.appendChild(div1);
            groups.appendChild(li);
        });
    } catch (error) {
        console.log(error);
    }
}

addToGroupBtn.addEventListener("click", addToGroup);

async function addToGroup() {
    try {
        const groupName = prompt("Enter the Chat-Group Name");
        const members = [];
        let userInput;
        while (userInput !== "done") {
            userInput = prompt(
                `Enter the email Id of Users to Add! Please Enter Valid Email Id Otherwise User will not get Added. Type "done" when you are finished with entering user Email Id!`
            );
            if (userInput !== "done") {
                members.push(userInput);
            }
        }
        const res = await axios.post(
            "http://localhost:2500/group/addToGroup",
            {
                groupName: groupName,
                members: members,
            }
        );
        alert(res.data.message);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

deleteFromGroupBtn.addEventListener("click", deleteFromGroup);

async function deleteFromGroup() {
    try {
        const groupName = prompt("Enter the Chat-Group Name");
        const members = [];
        let userInput;
        while (userInput !== "done") {
            userInput = prompt(
                `Enter the email Id of Users to Add! Please Enter Valid Email Id Otherwise User will not get Added. Type "done" when you are finished with entering user Email Id!`
            );
            if (userInput !== "done") {
                members.push(userInput);
            }
        }
        const res = await axios.post(
            "http://localhost:2500/group/deleteFromGroup",
            {
                groupName: groupName,
                members: members,
            }
        );
        alert(res.data.message);
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
}

// groupMembersBtn.addEventListener("click", groupMembers);

// async function groupMembers() {
//     try {
//         const chatBoxBody = document.getElementById("chatBoxBody");
//         if (chatBoxBody.querySelector(".groupMembersDiv")) {
//             const members = chatBoxBody.querySelectorAll(".groupMembersDiv");
//             members.forEach((member) => {
//                 member.remove();
//             });
//         }
//         const groupName = localStorage.getItem("groupName");
//         if (!groupName || groupName == "") {
//             return alert("Select the Group whose Members you wanna see!");
//         }
//         const res = await axios.get(
//             `http://localhost:2500/group/groupMembers/${groupName}`
//         );
//         res.data.users.forEach((user) => {
//             const div = document.createElement("div");
//             div.classList.add(
//                 "d-flex",
//                 "justify-content-center",
//                 "groupMembersDiv",
//                 "text-white"
//             );
//             const p = document.createElement("p");
//             p.appendChild(document.createTextNode(`${user.name} is Member`));
//             div.appendChild(p);
//             chatBoxBody.appendChild(div);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

logoutBtn.addEventListener("click", logout);

async function logout() {
    try {
        // Expire/delete the browser cookies
        // For delete or expire this cookies we have to write the path here. but for this user dashboard page writing path is optional because the path of page is / and path of cookies is also /. cookies path is taken by the rout or starting rout of the url
        document.cookie = "jwt_token=; max-age=-60"; // ? Any diff. way to do this and why we write like this ??
        window.location.href = "/";
    } catch (err) {
        console.log(err);
    }
}





