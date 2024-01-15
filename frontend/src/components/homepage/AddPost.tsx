import { Autocomplete, Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from "@mui/material";

import React, { useEffect, useState } from "react";
import { CategoryType } from "../../types";
import { getAllCategoriesRequest } from "../../RequestHandler";

function AddPost({ editName, editDescription, setEditName, createPostRequest, setAddTaskState, setEditDescription }: any) {
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState<CategoryType | null>(null);
  const loading = open && allCategories.length === 0;

  const getAllCategories = async (): Promise<CategoryType[]> => {
    try {
      let result = await getAllCategoriesRequest();
      result.unshift({ id: 0, name: "None" });
      return result;
    } catch (e: any) {
      console.log("error", e);
      return [];
    }
  };

  useEffect(() => {}, [allCategories]);
  useEffect(() => {
    let active = true;
    setSelectCategory({ id: 0, name: "None" });
    if (!loading) {
      return undefined;
    }
    (async () => {
      if (active) {
        const categoriesFromRequest: CategoryType[] = await getAllCategories();
        if (categoriesFromRequest.length !== 0) {
          setAllCategories(categoriesFromRequest);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setAllCategories([]);
    }
  }, [open]);

  return (
    <Box
      sx={{
        minWidth: 250,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Card
        style={{
          backgroundColor: "#04aa6d",
          margin: "auto",
        }}
        variant="outlined"
      >
        <React.Fragment>
          <CardContent sx={{ display: "flex" }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {/* {user? user.username : ""} */}
            </Typography>
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              placeholder={"Title"}
              onChange={(event) => {
                const { value } = event.target;
                setEditName(value);
              }}
              style={{ marginBottom: "10px" }}
            />

            <TextField
              id="outlined-basic"
              label="Content"
              variant="outlined"
              placeholder={"Content"}
              onChange={(event) => {
                const { value } = event.target;
                setEditDescription(value);
              }}
            />
            <Autocomplete
              id="async-category"
              sx={{ width: 300 }}
              open={open}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              isOptionEqualToValue={(allCategories, value) => allCategories.name === value.name}
              clearOnEscape
              value={selectCategory}
              onChange={(event: any, newValue: CategoryType | null) => {
                if (newValue !== null) {
                  setSelectCategory(newValue);
                } else {
                  setSelectCategory({ id: 0, name: "None" });
                }
              }}
              getOptionLabel={(allCategories) => allCategories.name}
              options={allCategories}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              type="submit"
              color="error"
              onClick={() => {
                setAddTaskState(-1);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                createPostRequest(null);
              }}
            >
              Create Post
            </Button>
          </CardActions>
        </React.Fragment>
      </Card>
    </Box>
  );
}

export default AddPost;
