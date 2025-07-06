/**
 * Get the users profile image url based on gender and name from liara api else ui-avatar
 * @param {string| number| boolean} The gender and name
 * @returns {string} The local IP address in the matching subnet
 */

export const generateProfileImage = (name: string | number | boolean, gender: string) => {
  switch (gender?.trim().toLowerCase()) {
    case 'male':
      return `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(name)}`;
    case 'female':
      return `https://avatar.iran.liara.run/public/girl?username=${encodeURIComponent(name)}`;
    default:
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&color=fff&bold=true`;
  }
};
