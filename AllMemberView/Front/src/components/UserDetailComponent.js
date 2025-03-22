import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  OutlinedInput,
  Avatar,
  Switch,
  Typography,
  styled,
  TextField,
  Select,
  MenuItem,
  Chip,
  InputLabel,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useParams, useNavigate } from "react-router-dom";
import { httpRequestUtil } from "../common/Utils";
import Grid2 from "@mui/material/Grid2";
import { DIR_PATH_AWS, DIR_PATH_LOCAL } from "../common/Const";

// カスタムスタイル
const StyledCard = styled(Card)({
  padding: "0.2em 0.5em",
  margin: "2em 0",
  background: "#d6ebff",
  boxShadow: "0px 0px 0px 10px #d6ebff",
  border: "dashed 2px white",
  borderRadius: "8px",
});

const imagePath = (fileName) => {
  return "/profile/" + fileName;
};

const isDataURL = (image) => {
  return image && image.startsWith("data:image/");
};

const initData = (targertInitData) => {
  let data = {
    userId: "",
    eMail: "",
    password: "",
    roleId: "",
    userName: "",
    joiningMonth: "",
    birthDate: "",
    hobby: "",
    image: "",
    departmentPosisitionIdList: "",
  };
  targertInitData.user = data;
};

const UserProfile = ({ isAdmin, isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // 削除状態
  const [selectedRoleValue, setRoleValue] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [dynamicSelects, setDynamicSelects] = useState([]);
  const [open, setOpen] = useState(false);
  const [isImageUpdate, setIsImageUpdate] = useState(false);

  const getUrl = () => {
    const envType = process.env.REACT_APP_ENV_TYPE;
    let getUserUrl = "";
    if (envType === "stg") {
      getUserUrl = process.env.REACT_APP_MY_IP + `user/${id}`;
    } else {
      getUserUrl = `http://localhost:8080/allmemberview/api/user/${id}`;
    }
    return getUserUrl;
  };

  const createUserUrl = () => {
    const envType = process.env.REACT_APP_ENV_TYPE;
    let createUserUrl = "";
    if (envType === "stg") {
      createUserUrl = process.env.REACT_APP_MY_IP + "create";
    } else {
      createUserUrl = "http://localhost:8080/allmemberview/api/create";
    }
    return createUserUrl;
  };

  const updateImageUrl = () => {
    const envType = process.env.REACT_APP_ENV_TYPE;
    let createUserUrl = "";
    let dirPath = "";
    if (envType === "stg") {
      createUserUrl = process.env.REACT_APP_MY_IP + "uploadimage";
      dirPath = DIR_PATH_AWS;
    } else {
      createUserUrl = "http://localhost:8080/allmemberview/api/uploadimage";
      dirPath = DIR_PATH_LOCAL;
    }
    return { url: createUserUrl, path: dirPath };
  };

  const fetchUserProfile = async () => {
    try {
      let responseData = [];
      // トークンがない場合、ログイン画面にリダイレクト
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/")
        return
      }
      responseData = await httpRequestUtil(getUrl(), null, "GET");
      if (isNew) {
        initData(responseData);
        setIsEditing(true);
      }

      setProfile(responseData);
      setImage(responseData.user.image);

      if (responseData.department !== 0) {
        let getDepartmentIds = responseData.department.map((value) => {
          return {
            id: value.departmentId,
            name: value.departmentName,
          };
        });
        let getPositionIds = responseData.department.map((value) => {
          return value.positionId;
        });
        setSelectedValues(getDepartmentIds);
        setDynamicSelects(getPositionIds);
      }
    } catch (err) {
      console.error("ユーザー情報取得エラー:", err);
      setError("ユーザー情報を取得できませんでした。");
      localStorage.removeItem("token");
      alert("エラーが発生しました。ログインからやり直してください");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // 入力値を更新し、エラーをリセット
    setProfile((prevProfile) => ({
      ...prevProfile,
      user: {
        ...prevProfile.user,
        [name]: value,
      },
    }));

    // 入力中にエラーをリセット
    setInputError((prevState) => ({
      ...prevState,
      [name]: false, // 入力中にエラー状態をリセット
    }));
  };

  // 入力がフォーカスを外れた時のエラーチェック
  const handleBlur = (event, regularExpression) => {
    const { name, value } = event.target;

    if (regularExpression && regularExpression.length !== 0) {
      const regex = new RegExp(regularExpression);
      const isValid = regex.test(value);

      setInputError((prevState) => ({
        ...prevState,
        [name]: !isValid, // 入力が正規表現に一致しない場合はエラー
      }));
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      setImageFile(file);
      setImageName(file.name);
      setIsImageUpdate(true);
    }
  };

  const validateForm = () => {
    let isValid = true;

    // isNewとisEditで確認する項目を分ける
    const requiredFieldsForNew = [
      "userId",
      "eMail",
      "password",
      "roleId",
      "departmentPosisitionIdList",
      "userName",
      "birthDate",
      "joiningMonth",
    ];
    const requiredFieldsForEdit = [
      "userName",
      "birthDate",
      "joiningMonth",
      "departmentPosisitionIdList",
    ];

    // isNewの場合は新規登録に必要な項目をチェック
    if (isNew) {
      requiredFieldsForNew.forEach((fieldName) => {
        if (!profile.user[fieldName]) {
          setInputError((prev) => ({
            ...prev,
            [fieldName]: true, // エラー状態を設定
          }));
          isValid = false;
        } else {
          setInputError((prev) => ({
            ...prev,
            [fieldName]: false, // エラーをリセット
          }));
        }
      });
    }

    // isEditの場合は編集に必要な項目をチェック
    if (isEditing) {
      requiredFieldsForEdit.forEach((fieldName) => {
        if (!profile.user[fieldName]) {
          setInputError((prev) => ({
            ...prev,
            [fieldName]: true, // エラー状態を設定
          }));
          isValid = false;
        } else {
          setInputError((prev) => ({
            ...prev,
            [fieldName]: false, // エラーをリセット
          }));
        }
      });
    }

    return isValid;
  };

  const handleSubmit = async () => {
    try {
      // profile情報の更新
      let departmetnData = "";
      if (selectedValues !== 0) {
        departmetnData = selectedValues.map((value, index) => {
          return {
            departmentId: value.id,
            positionId: dynamicSelects[index],
          };
        });
      }
      profile.user.departmentPosisitionIdList = departmetnData;

      // 権限情報の更新
      let roleData = "";
      if (selectedRoleValue) {
        roleData = selectedRoleValue;
      }
      profile.user.roleId = roleData;

      // バリデーションを実行
      if (!validateForm()) {
        alert("入力にエラーがあります。修正してください。");
        return;
      }

      if (!isNew) {
        const formData = new FormData();
        const imageUrl = updateImageUrl();
        let filename = "";

        // 画像ファイルの設定
        if (isImageUpdate) {
          // 拡張子を抽出するための正規表現。画像のファイル名作成のため
          const fileExtension = imageName.split(".").pop();
          const newFilename = `${id}.${fileExtension}`;
          formData.append("image", newFilename);

          // アップロード先の画像パス
          filename = imageUrl.path + newFilename;
        } else {
          formData.append("image", profile.user.image);
        }
        formData.append("userName", profile.user.userName);
        formData.append("birthDate", profile.user.birthDate);
        formData.append("hobby", profile.user.hobby);
        formData.append("joiningMonth", profile.user.joiningMonth);
        formData.append("departmentPosisitionIdList", JSON.stringify(profile.user.departmentPosisitionIdList));
        await httpRequestUtil(getUrl(), formData, "PUT");

        // 画像の更新があった場合
        if (isImageUpdate) {
          const formData = new FormData();
          formData.append("file", imageFile);
          formData.append("filename", filename);
          await httpRequestUtil(imageUrl.url, formData, "PUT");
        }

        alert("プロフィールが更新されました！");
        await fetchUserProfile();
        setIsEditing(false);
      } else {
        let imgname = "def.png";
        const imageUrl = updateImageUrl();
        const formData = new FormData();
        if (isImageUpdate) {
          // 拡張子を抽出するための正規表現。画像のファイル名作成のため
          const fileExtension = imageName.split(".").pop();
          const newFilename = `${id}.${fileExtension}`;
          imgname = newFilename;

          formData.append("file", imageFile);
          formData.append("filename", imageUrl.path + newFilename);
        }

        let body = {
          userId: profile.user.userId,
          eMail: profile.user.eMail,
          password: profile.user.password,
          roleId: profile.user.roleId,
          userName: profile.user.userName,
          birthDate: profile.user.birthDate,
          joiningMonth: profile.user.joiningMonth,
          hobby: profile.user.hobby,
          image: imgname,
          departmentPosisitionIdList: profile.user.departmentPosisitionIdList,
        };

        // プロフィール部分の登録
        await httpRequestUtil(createUserUrl(), body, "POST");

        // 画像の登録
        if (isImageUpdate) {
          await httpRequestUtil(imageUrl.url, formData, "PUT");
        }

        alert("登録が完了しました！");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("更新エラー:", err);
      alert("プロフィールの更新に失敗しました。");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除していいですか？")) return;

    try {
      await httpRequestUtil(getUrl(), null, "DELETE");

      // 削除成功後の処理
      setIsDeleted(true);
    } catch (err) {
      console.error("削除エラー:", err);
      alert("ユーザーの削除に失敗しました。");
    }
  };

  // 権限IDのセレクトボックスの変更処理
  const handleSelectRoleChange = (event) => {
    setRoleValue(event.target.value);
    setInputError((prevState) => ({
      ...prevState,
      [event.target.name]: false, // 入力中にエラー状態をリセット
    }));
  };

  // 最初のセレクトボックスの変更処理
  const handleSelectChange = (event) => {
    const selectedItems = event.target.value; // 変更された選択値（配列）
    let addCount = 0;
    let deleteCount = 0;

    setInputError((prevState) => ({
      ...prevState,
      [event.target.name]: false, // 入力中にエラー状態をリセット
    }));

    setSelectedValues((prevSelected) => {
      const lastSelectedItem = selectedItems[selectedItems.length - 1]; // 最後のアイテム

      let isDeletFlg = false;
      let deleteIndex = 0;

      // 最後の選ばれたアイテムのIDを持つものを prevSelected から削除
      const updatedSelectedValues = prevSelected.filter((item, index) => {
        if (item.id !== lastSelectedItem.id) {
          return true;
        } else {
          deleteIndex = index;
          isDeletFlg = true;
          return false;
        }
      });

      // `dynamicSelects` も更新
      if (isDeletFlg) {
        if (deleteCount === 0) {
          // 最後のアイテムが削除された場合、そのインデックスを削除
          setDynamicSelects((prevDynamicSelects) =>
            prevDynamicSelects.filter((_, index) => {
              if (index !== deleteIndex) {
                return true;
              } else {
                return false;
              }
            })
          );
        }
        deleteCount = 1;
      } else {
        if (addCount === 0) {
          // 新たに選ばれたアイテムを追加
          setDynamicSelects((prevDynamicSelects) => [
            ...prevDynamicSelects,
            "",
          ]);
          addCount = 1;
        }
      }

      if (updatedSelectedValues.length === 0) {
        return [lastSelectedItem];
      }

      if (isDeletFlg) {
        return updatedSelectedValues;
      } else {
        // 新たに選ばれたアイテムを追加
        return [...updatedSelectedValues, lastSelectedItem];
      }
    });

    setOpen(false); // メニューを閉じる
  };

  // 動的に追加されたセレクトボックスの変更処理
  const handleDynamicSelectChange = (index, target) => {
    const newSelects = [...dynamicSelects];
    newSelects[index] = target.value;
    setDynamicSelects(newSelects);
  };

  // ここで基本のベースの入力ボックス
  const baseInputBox = (
    labelName,
    inputValue,
    inputName,
    required,
    type,
    regularExpression
  ) => {
    return (
      <Box display="flex" alignItems="center" mb={2}>
        <Typography sx={{ width: labelPx }}>{labelName}</Typography>
        <FormControl
          fullWidth
          required={isEditing || isNew ? required : false}
          error={inputError[inputName]}
        >
          {(isEditing || isNew) && (
            <InputLabel htmlFor={inputName}>
              {required ? "Required" : ""}
            </InputLabel>
          )}

          <OutlinedInput
            value={inputValue}
            name={inputName}
            onChange={handleInputChange}
            readOnly={!isEditing}
            label={(isEditing || isNew) && (required ? "Required" : "")}
            type={type}
            onBlur={(e) => handleBlur(e, regularExpression)}
            inputProps={
              regularExpression && regularExpression.length !== 0
                ? { pattern: regularExpression }
                : {}
            }
            multiline={inputName === "hobby"} // hobbyの時は複数行
            minRows={inputName === "hobby" ? 3 : 1} // hobbyの場合は最小3行
          />
        </FormControl>
      </Box>
    );
  };

  // 部署の入力ボックスボックス
  const addDepartmentInputBox = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <FormControl
          sx={{ marginBottom: 2 }}
          required
          error={inputError["departmentPosisitionIdList"]}
        >
          <Select
            multiple
            value={selectedValues}
            onChange={handleSelectChange}
            open={open} // メニューが開いているかどうかを制御
            onOpen={() => setOpen(true)} // メニューが開かれるとき
            onClose={() => setOpen(false)} // メニューが閉じられるとき
            displayEmpty
            renderValue={() => "部署追加 *"}
            name="departmentPosisitionIdList"
          >
            {profile.selectDepartmentList.map((department) => (
              <MenuItem
                key={department.id}
                value={{ id: department.id, name: department.name }}
              >
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Grid2 container spacing={2} direction="column">
            {/* 選択された部署の役職を選択 */}
            {selectedValues.map((value, index) => (
              <Grid2 container key={index} alignItems="center" mb={2}>
                {/* 役職 */}
                <Grid2 size={{ xs: 3 }}>
                  <TextField
                    select
                    fullWidth
                    label="役職"
                    value={dynamicSelects[index] || ""}
                    onChange={(e) => handleDynamicSelectChange(index, e.target)}
                    variant="standard"
                    name="departmentPosisitionIdList"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {profile.selectPositionList.map((positon) => (
                      <MenuItem key={positon.id} value={positon.id}>
                        {positon.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>

                {/* 選択された部署名 */}
                <Grid2 size={{ xs: 9 }}>
                  <TextField
                    label="部署名"
                    variant="standard"
                    value={value.name}
                    disabled
                  />
                </Grid2>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>
    );
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  if (isDeleted) {
    // 削除成功後の表示
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h5" color="error" gutterBottom>
          削除が完了しました
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")} // ユーザー一覧ページへの遷移
        >
          ユーザー一覧に戻る
        </Button>
      </Box>
    );
  }

  const labelPx = "100px";

  return (
    <Box
      sx={{ padding: 3, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Grid2 container justifyContent="center">
        {/* 画像 */}
        <Grid2 size={{ xs: 12, md: 3 }} display="flex" justifyContent="center">
          <Box>
            <Avatar
              alt={profile.user.userName}
              src={isDataURL(image) ? image : imagePath(image)}
              sx={{
                width: 200,
                height: 200,
                border: "3px solid #1976d2",
                boxShadow: 3,
              }}
            />
            {isEditing && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<AddAPhotoIcon />}
                >
                  画像を選択
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageFileChange}
                  />
                </Button>
              </Box>
            )}
          </Box>
        </Grid2>

        {/* プロフィール部分 */}
        <Grid2 size={{ xs: 12, md: 5 }}>
          <StyledCard variant="outlined" sx={{ boxShadow: 3 }}>
            <CardHeader
              title="ユーザー詳細"
              action={
                !isNew &&
                isAdmin && (
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ marginRight: 1 }}>
                      {isEditing ? "編集モード" : "閲覧モード"}
                    </Typography>
                    <Switch
                      checked={isEditing}
                      onChange={() => setIsEditing(!isEditing)}
                      color="primary"
                    />
                  </Box>
                )
              }
            />
            <Divider />
            <CardContent>
              {/* ユーザID */}
              {isNew &&
                baseInputBox(
                  "ユーザID",
                  profile.user.userId,
                  "userId",
                  true,
                  "",
                  "^[1-9][0-9]*$"
                )}

              {/* メールアドレス */}
              {isNew &&
                baseInputBox(
                  "EMail",
                  profile.user.eMail,
                  "eMail",
                  true,
                  "email",
                  "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                )}

              {/* パスワード */}
              {isNew &&
                baseInputBox(
                  "パスワード",
                  profile.user.password,
                  "password",
                  true,
                  "password",
                  ""
                )}

              {/* 権限ID */}
              {isNew && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography sx={{ width: labelPx }}>権限</Typography>
                  <FormControl fullWidth required error={inputError["roleId"]}>
                    <InputLabel>Required</InputLabel>
                    <Select
                      value={selectedRoleValue}
                      onChange={handleSelectRoleChange}
                      label={"Required"}
                      name="roleId"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {profile.selectRoleList.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* 名前 */}
              {baseInputBox(
                "名前",
                profile.user.userName,
                "userName",
                true,
                "",
                ""
              )}

              {/* 入社月 */}
              {baseInputBox(
                "入社月",
                profile.user.joiningMonth,
                "joiningMonth",
                true,
                "",
                "^(19|20)\\d{2}\\/([0][1-9]|1[0-2])$"
              )}

              {/* 部署 */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ width: labelPx }}>部署</Typography>
                {!isNew && !isEditing ? (
                  <>
                    <FormControl fullWidth required>
                      <OutlinedInput
                        value={profile.department
                          .map((dep) => dep.departmentName)
                          .join(", ")}
                        readOnly
                      />
                    </FormControl>
                  </>
                ) : (
                  <>{addDepartmentInputBox()}</>
                )}
              </Box>

              {/* 誕生日 */}
              {baseInputBox(
                "誕生日",
                profile.user.birthDate,
                "birthDate",
                true,
                "",
                "^(1[1-2]|[1-9])/(3[01]|[12][0-9]|[1-9])$"
              )}

              {/* 趣味 */}
              {baseInputBox("趣味", profile.user.hobby, "hobby", false, "", "")}
            </CardContent>
            <Box display="flex" justifyContent="flex-end" p={2}>
              {/* isEditingがtrueのときだけ保存と削除ボタンを表示 */}
              {isEditing && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ marginRight: 2 }}
                  >
                    保存
                  </Button>
                  {!isNew && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleDelete}
                      sx={{ marginRight: 2 }}
                    >
                      削除
                    </Button>
                  )}
                </>
              )}

              {/* 戻るボタンは常に表示 */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/dashboard")} // 不要なカッコを削除
                sx={{ marginRight: 2 }}
              >
                戻る
              </Button>
            </Box>
          </StyledCard>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default UserProfile;
