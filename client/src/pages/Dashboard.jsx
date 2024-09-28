import { Box, Button, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { getTasks, updateTaskStatus } from "../redux/task-redux/action";
import SearchAndSort from "../components/SearchAndSort";
import ModalComponent from "../components/ModalComponent";
import TaskList from "../components/TaskCard";

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const dispatch = useDispatch();
  const { tasks = [] } = useSelector((state) => state.task);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOption === "least") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortOption === "az") {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === "za") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  const createDropZone = (status) => {
    const [{ isOver }, dropRef] = useDrop({
      accept: "task",
      drop: (item) => {
        dispatch(updateTaskStatus(item.taskId, status));
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });
    return dropRef;
  };

  return (
    <div style={{ padding: "10px" }}>
      <Box
        px={5}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="column"
        gap="20px"
      >
        <Box
          display="flex"
          alignItems="start"
          width={{ base: "100%", md: "70%", lg: "100%" }}
        >
          <Button
            onClick={onOpen}
            bgColor="blue.400"
            color="white"
            px={14}
            width={{ base: "100%", md: "100%", lg: "20%" }}
          >
            Add Task
          </Button>
        </Box>

        <SearchAndSort
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        <Box width="100%" height="100vh">
          <SimpleGrid spacing={4} columns={{ base: 1, md: 2, lg: 3 }}>
            <Box ref={createDropZone("todo")}>
              <TaskList
                title="TODO"
                tasks={filteredTasks.filter((task) => task.status === "todo")}
              />
            </Box>

            <Box ref={createDropZone("in-progress")}>
              <TaskList
                title="IN PROGRESS"
                tasks={filteredTasks.filter(
                  (task) => task.status === "in-progress"
                )}
              />
            </Box>

            <Box ref={createDropZone("done")}>
              <TaskList
                title="DONE"
                tasks={filteredTasks.filter((task) => task.status === "done")}
              />
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        initialRef={initialRef}
        finalRef={finalRef}
      />
    </div>
  );
}

export default Dashboard;
