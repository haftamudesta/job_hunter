export const getPasswordStrengthLevel = (password:string,passwordStrength:number) => {
    if (password.length === 0) return 0; // Empty
    if (password.length < 8) return 1; // Too short
    if (passwordStrength < 40) return 2; // Weak
    if (passwordStrength < 70) return 3; // Fair
    if (passwordStrength < 80) return 4; //Strong
    return 5; // very Strong
  };

 export const getStrengthBars = (password:string,passwordStrength:number) => {
    const level = getPasswordStrengthLevel(password,passwordStrength);
    return [
      {
        active: level >= 1,
        color: level >= 1 ? "bg-red-500" : "bg-gray-200",
        label: "Too Short",
      },
      {
        active: level >= 2,
        color: level >= 2 ? "bg-orange-500" : "bg-gray-200",
        label: "Weak",
      },
      {
        active: level >= 3,
        color: level >= 3 ? "bg-yellow-500" : "bg-gray-200",
        label: "Fair",
      },
      {
        active: level >= 4,
        color: level >= 4 ? "bg-green-500" : "bg-gray-200",
        label: "Strong",
      },
      {
        active: level >= 5,
        color: level >= 5 ? "bg-emerald-500" : "bg-gray-200",
        label: "Very Strong",
      },
    ];
  };

 export const getStrengthText = (password:string,passwordStrength:number) => {
    const level = getPasswordStrengthLevel(password,passwordStrength);
    switch (level) {
      case 0:
        return "Enter a password";
      case 1:
        return "Too short (min 8 characters)";
      case 2:
        return "Weak";
      case 3:
        return "Fair";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "Enter a password";
    }
  };

  export const validateForm = (
  name: string,
  email: string, 
  password: string,
  confirmPassword: string,
  setError: (error: string) => void 
): boolean => { 
  if (!name.trim()) {
    setError("Please enter your name");
    return false;
  }

  if (!email.trim()) {
    setError("Please enter your email");
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("Please enter a valid email address");
    return false;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long");
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    setError("Password must contain at least one uppercase letter");
    return false;
  }

  if (!/[a-z]/.test(password)) {
    setError("Password must contain at least one lowercase letter");
    return false;
  }

  if (!/[0-9]/.test(password)) {
    setError("Password must contain at least one number");
    return false;
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    setError("Password must contain at least one special character");
    return false;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return false;
  }

  return true;
};