import type { FC } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Box from "@mui/material/Box";

import { TaskAdd } from "../task-add";
import { TaskCard } from "../task-card";
import { ColumnHeader } from "./column-header";
import { Column, Tasks } from "src/types";
import { Scrollbar } from "src/utils/scrollbar";

interface ColumnCardProps {
  column: Column;
  onClear?: () => void;
  onDelete?: () => void;
  onRename?: (name: string) => void;
  onTaskAdd?: (name?: string) => void;
  onTaskOpen?: (task: Tasks) => void;
}

export const ColumnCard: FC<ColumnCardProps> = (props) => {
  const {
    column,
    onTaskAdd,
    onTaskOpen,
    onClear,
    onDelete,
    onRename,
    ...other
  } = props;

  if (!column) {
    return null;
  }

  const tasksCount = column?.tasks?.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "hidden",
        width: {
          xs: 300,
          sm: 350,
        },
      }}
      {...other}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.900" : "neutral.100",
          borderRadius: 1,

          py: 1,
          // height: "75vh",
        }}
      >
        <Scrollbar
          sx={{
            maxHeight: {
              lg: "71vh",
              md: "56vh",
            },
            overflowY: "auto",
          }}
        >
          <ColumnHeader
            name={column.name}
            onClear={onClear}
            onDelete={onDelete}
            onRename={onRename}
            tasksCount={tasksCount}
          />

          <Box
            sx={{
              pt: 0.5,
              pb: 0.5,
              px: 2,
            }}
          >
            <TaskAdd onAdd={onTaskAdd} />
          </Box>

          <Droppable droppableId={column._id} type="task">
            {(droppableProvider): JSX.Element => (
              <Box
                ref={droppableProvider.innerRef}
                sx={{
                  flexGrow: 1,
                  minHeight: 80,
                  overflowY: "auto",
                  px: 2,
                }}
              >
                {column?.tasks?.map((task: Tasks, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(draggableProvided, snapshot): JSX.Element => (
                      <Box
                        ref={draggableProvided.innerRef}
                        style={{ ...draggableProvided.draggableProps.style }}
                        sx={{
                          outline: "none",
                          py: 0.5,
                        }}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <TaskCard
                          key={task._id}
                          dragging={snapshot.isDragging}
                          onOpen={() => onTaskOpen?.(task)}
                          task={task}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {droppableProvider.placeholder}
              </Box>
            )}
          </Droppable>
        </Scrollbar>
      </Box>
    </Box>
  );
};

// ColumnCard.propTypes = {
//   column: PropTypes.W.isRequired,
//   onClear: PropTypes.func,
//   onDelete: PropTypes.func,
//   onRename: PropTypes.func,
//   onTaskAdd: PropTypes.func,
//   onTaskOpen: PropTypes.func,
// };
