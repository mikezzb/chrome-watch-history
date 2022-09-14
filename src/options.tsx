import { observer } from "mobx-react-lite";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";
import StoreProvider, { useConfig } from "./core";

type SectionProps = {
  title: string;
};
const Seciton: FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="section cvh-column cvh-flex">
      <h3 className="title section-title">{title}</h3>
      {children}
    </div>
  );
};

type FieldProps = {
  label: string;
  value: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const Field: FC<FieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="field cvh-flex">
      <span className="caption field-label">{label}</span>
      <input className="field-input" value={value} onChange={onChange} />
    </div>
  );
};

const FIELDS = {
  maxRecords: "Max records:",
  syncInterval: "Sync interval (ms):",
  recordThreshold: "Min video duration (s):",
};

const Options: FC = observer(() => {
  const config = useConfig();
  return (
    <div className="container">
      <h2 className="header">Chrome Watch History Options</h2>
      <hr />
      <Seciton title="Configs">
        {Object.entries(FIELDS).map(([k, v]) => (
          <Field
            label={v}
            key={k}
            value={(config as any)[k]}
            onChange={(e) => config.setStore(k, e.target.value)}
          />
        ))}
      </Seciton>
    </div>
  );
});

const OptionsContainer: FC = observer(() => {
  return (
    <StoreProvider>
      <Options />
    </StoreProvider>
  );
});

ReactDOM.render(
  <React.StrictMode>
    <OptionsContainer />
  </React.StrictMode>,
  document.getElementById("root")
);
