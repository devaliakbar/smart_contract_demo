var accountName = "Unknown";
var TodoList;
var todoList;

window.addEventListener("load", async () => {
    init()
})

async function init() {
    await loadWeb3()
    await loadAccount()
    await loadContract()
    await render()
}

async function loadWeb3(params) {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */ });
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */ });
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

async function loadAccount() {
    const account = await ethereum.request({ method: 'eth_requestAccounts' });
    accountName = account[0];
}

async function loadContract() {
    const todoListJson = await $.getJSON('TodoList.json')
    TodoList = TruffleContract(todoListJson)
    TodoList.setProvider(web3.currentProvider)
    todoList = await TodoList.deployed()
}

async function render() {
    $('#taskslist').html("")
    const taskCount = await todoList.taskCount()
    for (var i = 1; i <= taskCount; i++) {
        const task = await todoList.tasks(i)
        if (task[1] == "") {
            continue;
        }

        var taskHTML = `
        <div>
            <input type="checkbox" id="checkbox${task[0].toNumber()}" ${task[2] ? 'checked' : ''}/>
            <input type="text" id="content${task[0].toNumber()}" value="${task[1]}"/>
            <button onclick="update(${task[0].toNumber()})">Update</button>
            <button onclick="deleteTask(${task[0].toNumber()})">Delete</button>
        </div>
        `;
        $('#taskslist').append(taskHTML)
    }
}

async function createTask() {
    const content = $('#taskcontent').val()
    if (content == "" || content == null) {
        alert("Please enter content")
        return
    }

    $.blockUI({ message: '<h1>Just a moment...</h1>' });
    await todoList.createTask(content, { from: accountName })
    $.unblockUI();
    render()
}

async function update(taskId) {
    const newContent = $('#content' + taskId).val()
    if (newContent == "" || newContent == null) {
        alert("Please enter content")
        return
    }

    const isCompleted = $('#checkbox' + taskId).is(":checked")

    $.blockUI({ message: '<h1>Just a moment...</h1>' });
    await todoList.updateTask(taskId, newContent, isCompleted, { from: accountName })
    $.unblockUI();
    render()
}

async function deleteTask(taskId) {
    $.blockUI({ message: '<h1>Just a moment...</h1>' });
    await todoList.deleteTask(taskId, { from: accountName })
    $.unblockUI();
    render()
}