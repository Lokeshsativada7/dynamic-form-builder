export const sampleFormSchema =
  [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter a unique username",
      defaultValue: "",
      rules: {
        required: true,
        minLength: 4,
        maxLength: 20,
        pattern: "^[a-zA-Z0-9_]+$"
      }


    },

    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
      defaultValue: "",
      rules: {
        required: true,
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      }
    },
    {
      name: "role",
      label: "ACC ROLE",
      type: "select",
      options: [
        { label: "Select a role", value: "" },
        { label: "User", value: "user" },
        { label: "Admin", value: "admin" },
        { label: "Guest", value: "guest" }
      ],
      defaultValue: "",
      rules: {
        required: true
      }
    },
    {
      name: "adminCode",
      label: "Admin Authorization Code",
      type: "password",
      placeholder: "Required for Admins",
      defaultValue: "",
      showIf: { dependency: "role", equals: "admin" },
      rules: {
        required: true,
        minLength: 6
      }
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "Enter your age",
      defaultValue: "",
      rules: {
        required: true,
        min: 18,
        max: 120
      }
    },
    {
      name: "newsletter",
      label: "Subscribe to newsletter",
      type: "checkbox",
      defaultValue: false
    },
    {
      name: "topics",
      label: "Interested Topics (Max 3)",
      type: "repeater",
      showIf: { dependency: "newsletter", equals: true },
      itemSchema: [
        {
          name: "topicName",
          label: "Topic Name",
          type: "text",
          placeholder: "e.g. Technology",
          rules: { required: true, minLength: 2 }
        }
      ],
      rules: {
        maxItems: 3
      }
    }
  ];
