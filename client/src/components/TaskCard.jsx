import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import ViewModal from "./ViewModal";
import { useDispatch } from "react-redux";
import { deleteTask } from "../redux/task-redux/action";
import EditModal from "./EditModal";

const TaskCard = ({ task }) => {
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const dispatch = useDispatch();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "task",
    item: { taskId: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleView = (id) => {
    setSelectedTaskId(id);
    onViewOpen();
  };

  const handleEdit = (id) => {
    setSelectedTaskId(id);
    onEditOpen();
  };

  return (
    <>
      <Box
        ref={dragRef}
        p={3}
        borderRadius="md"
        mb={2}
        bgColor="#b9d9e8"
        opacity={isDragging ? 0.5 : 1}
        display="flex"
        flexDirection="column"
        gap="20px"
      >
        <Box>
          <Heading size="sm">{task.title}</Heading>
          <Text>{task.description}</Text>
        </Box>

        <Box display="flex" flexDirection="column" gap="10px">
          <Text color="gray" fontSize="xs">
            Created at: {new Date(task?.createdAt)?.toLocaleString()}
          </Text>

          {task?.dueDate ? (
            <Text color="gray" fontSize="xs">
              Due date: {new Date(task?.dueDate)?.toLocaleString()}
            </Text>
          ) : (
            ""
          )}

          <Box display="flex" justifyContent="end" gap="10px">
            <Button
              bgColor="red"
              color="white"
              fontSize="xs"
              h="auto"
              minWidth="auto"
              px="10px"
              py="5px"
              onClick={() => handleDelete(task._id)}
            >
              Delete
            </Button>
            <Button
              bgColor="blue.400"
              color="white"
              fontSize="xs"
              h="auto"
              minWidth="auto"
              px="10px"
              py="5px"
              onClick={() => handleEdit(task._id)}
            >
              Edit
            </Button>
            <Button
              bgColor="blue.600"
              color="white"
              fontSize="xs"
              h="auto"
              minWidth="auto"
              px="10px"
              py="5px"
              onClick={() => handleView(task._id)}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>

      <ViewModal
        id={selectedTaskId}
        isOpen={isViewOpen}
        onClose={onViewClose}
        initialRef={initialRef}
        finalRef={finalRef}
      />

      <EditModal
        id={selectedTaskId}
        isOpen={isEditOpen}
        onClose={onEditClose}
        initialRef={initialRef}
        finalRef={finalRef}
      />
    </>
  );
};

const TaskList = ({ tasks, title }) => {
  return (
    <>
      <Card>
        <CardHeader bgColor="blue.400" color="white" rounded="sm">
          <Heading size="md">{title}</Heading>
        </CardHeader>
        <CardBody>
          {tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default TaskList;
