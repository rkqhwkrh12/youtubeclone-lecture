export const join = (req, res) => res.send("Join");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User"); 
//자바스크립트 안에는 delete가 이미 지정되어 있음.
export const login = (req, res) =>  res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");