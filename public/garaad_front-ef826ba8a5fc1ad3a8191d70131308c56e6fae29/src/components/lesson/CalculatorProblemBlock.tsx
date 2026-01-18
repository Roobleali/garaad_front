import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface InputFieldWithLabelProps {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  inputStyles?: React.CSSProperties;
  labelStyles?: React.CSSProperties;
  labelPosition?: string;
  disabled?: boolean;
}

interface VerificationModuleProps {
  id: string;
  label: string;
  value: string;
  action: string;
  buttonLabel: string;
  onAction: () => void;
  inputStyles?: React.CSSProperties;
  buttonStyles?: React.CSSProperties;
  moduleStyles?: React.CSSProperties;
}

interface CalculatorProblemBlockProps {
  question: string;
  which?: string;
  view: any;
  onContinue: () => void;
}

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = ({
  id,
  label,
  value,
  onChange,
  inputStyles,
  labelStyles,
  labelPosition = "top",
  disabled = false,
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: "5px",
          textAlign: "center",
          ...labelStyles,
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "120px",
          border: "1px solid black",
          height: "30px",
          textAlign: "center",
          ...inputStyles,
        }}
      />
    </div>
  );
};

const VerificationModule: React.FC<VerificationModuleProps> = ({
  id,
  label,
  value,
  buttonLabel,
  onAction,
  inputStyles,
  buttonStyles,
  moduleStyles,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...moduleStyles,
      }}
    >
      <label style={{ marginBottom: "5px", textAlign: "center" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        style={{
          width: "180px",
          border: "1px solid black",
          height: "25px",
          marginBottom: "10px",
          textAlign: "center",
          ...inputStyles,
        }}
      />
      <button
        onClick={onAction}
        style={{
          width: "80px",
          border: "1px solid gray",
          height: "30px",
          borderRadius: "5px",
          backgroundColor: "#D3D3D3",
          ...buttonStyles,
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

const CalculatorProblemBlock: React.FC<CalculatorProblemBlockProps> = ({
  view,
  onContinue,
}) => {
  // State for calculator values
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, string>>({});

  // Initialize values from view configuration
  useEffect(() => {
    if (view && view.sections) {
      const initialValues: Record<string, string> = {};

      view.sections.forEach((section: any) => {
        if (section.elements) {
          section.elements.forEach((element: any) => {
            if (
              element.type === "input_field_with_label" ||
              element.type === "input_field"
            ) {
              initialValues[element.id] = element.value || "";
            } else if (element.type === "verification_module") {
              initialValues[element.id] = element.value || "";
            } else if (element.type === "section") {
              // Handle nested sections
              element.elements?.forEach((nestedElement: any) => {
                if (
                  nestedElement.type === "input_field_with_label" ||
                  nestedElement.type === "input_field"
                ) {
                  initialValues[nestedElement.id] = nestedElement.value || "";
                }
              });
            }
          });
        }
      });

      setValues(initialValues);
    }
  }, [view]);

  // Handle input change
  const handleInputChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  // Modular exponentiation for calculations
  const modPow = (base: number, exponent: number, modulus: number) => {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result = (result * base) % modulus;
      }
      exponent = Math.floor(exponent / 2);
      base = (base * base) % modulus;
    }
    return result;
  };

  // Handle special calculations based on calculator type
  useEffect(() => {
    console.log("TYPE OF CALCULATOR", view?.type);
    if (view?.type === "calculator_interface") {
      // ElGamal signature calculator logic
      const n = parseInt(values.param_n) || 29;
      const g = parseInt(values.param_g) || 17;
      const sk = parseInt(values.sk_field) || 0;
      const m = parseInt(values.message_field) || 0;

      // Calculate public key
      if (sk > 0) {
        const pk = modPow(g, sk, n);
        handleInputChange("pk_field", pk.toString());
      }

      // Calculate signature
      if (sk > 0 && m > 0) {
        const sig = (sk * m) % n;
        handleInputChange("signature_field", sig.toString());
      }
    } else if (view?.type === "modular_arithmetic_calculator") {
      // Simple modular arithmetic calculator
      const a = parseInt(values.input_a) || 0;
      const b = parseInt(values.input_b) || 0;
      const n = parseInt(values.input_n) || 0;

      if (a > 0 && b > 0 && n > 0) {
        const result = (a * b) % n;
        handleInputChange("result_field", result.toString());
      }
    }
  }, [values, view?.type]);

  // Handle verification actions
  const handleVerification = (actionType: string) => {
    const n = parseInt(values.param_n) || 29;
    const g = parseInt(values.param_g) || 17;

    if (actionType === "check_pk_m_mod_n") {
      const pk = parseInt(values.pk_field) || 0;
      const m = parseInt(values.message_field) || 0;
      if (pk > 0 && m > 0) {
        const result = (pk * m) % n;
        setResults({ ...results, pk_m_verification: result.toString() });
      }
    } else if (actionType === "check_sig_g_mod_n") {
      const sig = parseInt(values.signature_field) || 0;
      if (sig > 0) {
        const result = (sig * g) % n;
        setResults({ ...results, sig_g_verification: result.toString() });
      }
    }
  };

  // Render calculator based on view type
  const renderCalculator = () => {
    if (!view) return null;

    console.log("VIEW", view);

    return (
      <div style={view.mainContainerStyles}>
        {view.sections.map((section: any, sectionIndex: number) => (
          <div key={sectionIndex} style={section.sectionStyles}>
            {section.title && (
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {section.title}
              </div>
            )}
            <div style={{ display: "flex", width: "100%" }}>
              {section.elements.map((element: any, elementIndex: number) => {
                if (element.type === "input_field_with_label") {
                  return (
                    <InputFieldWithLabel
                      key={elementIndex}
                      id={element.id}
                      label={element.label}
                      value={values[element.id] || ""}
                      onChange={(value) => handleInputChange(element.id, value)}
                      inputStyles={element.inputStyles}
                      labelStyles={element.labelStyles}
                      labelPosition={element.labelPosition}
                      disabled={
                        element.id === "pk_field" ||
                        element.id === "signature_field" ||
                        element.id === "result_field"
                      }
                    />
                  );
                } else if (element.type === "verification_module") {
                  return (
                    <VerificationModule
                      key={elementIndex}
                      id={element.id}
                      label={element.label}
                      value={results[element.id] || ""}
                      action={element.action}
                      buttonLabel={element.buttonLabel}
                      onAction={() => handleVerification(element.action)}
                      inputStyles={element.inputStyles}
                      buttonStyles={element.buttonStyles}
                      moduleStyles={element.moduleStyles}
                    />
                  );
                } else if (element.type === "circular_indicator") {
                  return <div key={elementIndex} style={element.styles} />;
                } else if (element.type === "section") {
                  // Handle nested sections
                  return (
                    <div key={elementIndex} style={element.sectionStyles}>
                      {element.title && (
                        <div
                          style={{ fontWeight: "bold", marginBottom: "10px" }}
                        >
                          {element.title}
                        </div>
                      )}
                      {element.elements.map(
                        (nestedElement: any, nestedIndex: number) => {
                          if (nestedElement.type === "input_field_with_label") {
                            return (
                              <InputFieldWithLabel
                                key={`nested-${nestedIndex}`}
                                id={nestedElement.id}
                                label={nestedElement.label}
                                value={values[nestedElement.id] || ""}
                                onChange={(value) =>
                                  handleInputChange(nestedElement.id, value)
                                }
                                inputStyles={nestedElement.inputStyles}
                                labelStyles={nestedElement.labelStyles}
                                labelPosition={nestedElement.labelPosition}
                                disabled={
                                  nestedElement.id === "pk_field" ||
                                  nestedElement.id === "signature_field"
                                }
                              />
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                  );
                } else if (element.type === "text_label") {
                  return (
                    <div key={elementIndex} style={element.styles}>
                      {element.text}
                    </div>
                  );
                } else if (element.type === "input_field") {
                  return (
                    <input
                      key={elementIndex}
                      type="text"
                      value={values[element.id] || ""}
                      onChange={(e) =>
                        handleInputChange(element.id, e.target.value)
                      }
                      style={element.inputStyles}
                      readOnly={element.id === "result_field"}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
        <Button onClick={onContinue} className="mt-4 w-full">
          Sii wado
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      {renderCalculator()}
    </div>
  );
};

export default CalculatorProblemBlock;
