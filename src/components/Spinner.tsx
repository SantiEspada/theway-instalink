import * as React from 'react';

export interface SpinnerProps {
  size?: number;
}

Spinner.DEFAULT_SIZE = 171;

function Spinner(props: SpinnerProps) {
  const { size = Spinner.DEFAULT_SIZE } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        margin: 'auto',
        background: '0 0',
      }}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      display="block"
      {...props}
    >
      <circle cx={50} cy={50} r={0} fill="none" stroke="#500d68">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.2987012987012987s"
          values="0;30"
          keyTimes="0;1"
          keySplines="0 0.2 0.8 1"
          calcMode="spline"
          begin="0s"
        />
        <animate
          attributeName="opacity"
          repeatCount="indefinite"
          dur="1.2987012987012987s"
          values="1;0"
          keyTimes="0;1"
          keySplines="0.2 0 0.8 1"
          calcMode="spline"
          begin="0s"
        />
      </circle>
      <circle cx={50} cy={50} r={0} fill="none" stroke="#f2ccff">
        <animate
          attributeName="r"
          repeatCount="indefinite"
          dur="1.2987012987012987s"
          values="0;30"
          keyTimes="0;1"
          keySplines="0 0.2 0.8 1"
          calcMode="spline"
          begin="-0.6493506493506493s"
        />
        <animate
          attributeName="opacity"
          repeatCount="indefinite"
          dur="1.2987012987012987s"
          values="1;0"
          keyTimes="0;1"
          keySplines="0.2 0 0.8 1"
          calcMode="spline"
          begin="-0.6493506493506493s"
        />
      </circle>
    </svg>
  );
}

export default Spinner;
