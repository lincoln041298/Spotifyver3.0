import React from "react";

interface Props {
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  label: string;
}

const IconButton = ({ icon: Icon, label }: Props) => {
  return (
    <div>
      <button className="flex items-center space-x-2 hover:text-white">
        <Icon className="text-gray-500 icon" />
        <span>{label}</span>
      </button>
    </div>
  );
};

export default IconButton;
