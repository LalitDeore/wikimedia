//code to validate is user enter data is ok or not
export const validate = (data, type) => {
  const errors = {};

  if (!data.email) {
    errors.email = "Email is Required!";
  } else if (!data.email.length === 0) {
    errors.email = "Email can't be empty";
  } else if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(data.email).toLowerCase()
    )
  ) {
    errors.email = "Email address is invalid!";
  } else {
    delete errors.email;
  }
  if (!data.number) {
    errors.number = "Phone Number is Required";
  } else if (data.number.length !== 10) {
    errors.number = "Phone number size must be equal to 10";
  } else {
    delete errors.number;
  }

  if (!data.password) {
    errors.password = "Password is Required";
  } else if (!(data.password.length >= 6)) {
    errors.password = "Password needs to be 6 character or more";
  } else {
    delete errors.password;
  }

  return errors;
};
