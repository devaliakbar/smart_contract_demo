pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    event TaskEdited(uint id, string content, bool completed);
    event DeleteTask(uint id, string content, bool completed);

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskEdited(taskCount, _content, false);
    }

    function updateTask(
        uint _id,
        string memory _content,
        bool _completed
    ) public {
        Task memory _task = tasks[_id];
        _task.content = _content;
        _task.completed = _completed;
        tasks[_id] = _task;
        emit TaskEdited(_task.id, _task.content, _task.completed);
    }

    function deleteTask(uint _id) public {
        Task memory _task = tasks[_id];

        delete tasks[_id];

        emit DeleteTask(_task.id, _task.content, _task.completed);
    }
}
