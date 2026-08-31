import { useState } from "react";
import calculatorIcon from "./assets/icon-calculator.svg";
import emptyIllustration from "./assets/illustration-empty.svg";
import FormInput from "./FormInput";

const initialFormData = {
  mortgageAmount: "",
  mortgageTerm: "",
  interestRate: "",
  mortgageType: "",
};

type FormField = keyof typeof initialFormData;

const initialErrors = {
  mortgageAmount: "",
  mortgageTerm: "",
  interestRate: "",
  mortgageType: "",
};

const initialTouched = {
  mortgageAmount: false,
  mortgageTerm: false,
  interestRate: false,
  mortgageType: false,
};

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState(initialTouched);
  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalRepayment: 0,
  });

  function validateField(name: FormField, value: string) {
    if (value.trim() === "") {
      return "This field is required";
    }

    if (name === "mortgageAmount" && Number(value) <= 0) {
      return "Must be greater than 0";
    }

    if (name === "mortgageTerm" && Number(value) <= 0) {
      return "Must be greater than 0";
    }

    if (name === "interestRate" && Number(value) < 0) {
      return "Must be 0 or greater";
    }

    return "";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as FormField;
    const value = e.target.value;

    let nextValue = value;

    if (name === "interestRate") {
      nextValue = value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    } else if (name !== "mortgageType") {
      nextValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, nextValue),
      }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.name as FormField;

    if (!touched[name]) return;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  }

  function calculateMortgage() {
    const principal = Number(formData.mortgageAmount);
    const numberOfPayments = Number(formData.mortgageTerm) * 12;
    const monthlyRate = Number(formData.interestRate) / 100 / 12;
    const compoundFactor = Math.pow(1 + monthlyRate, numberOfPayments);

    let monthlyPayment = 0;
    let totalRepayment = 0;

    if (formData.mortgageType === "repayment") {
      if (monthlyRate === 0) {
        monthlyPayment = principal / numberOfPayments;
      } else {
        monthlyPayment =
          (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);
      }

      totalRepayment = monthlyPayment * numberOfPayments;
    }

    if (formData.mortgageType === "interestOnly") {
      monthlyPayment = principal * monthlyRate;

      totalRepayment = monthlyPayment * numberOfPayments + principal;
    }

    return {
      monthlyPayment,
      totalRepayment,
    };
  }

  function clearAll() {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setTouched(initialTouched);

    setResults({
      monthlyPayment: 0,
      totalRepayment: 0,
    });

    setSubmitted(false);
  }

  function validateForm() {
    return Object.keys(formData).reduce(
      (acc, key) => {
        const name = key as FormField;

        acc[name] = validateField(name, formData[name]);

        return acc;
      },
      {} as typeof initialErrors,
    );
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = validateForm();

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);

    if (hasErrors) return;

    const calculatedResults = calculateMortgage();

    setResults(calculatedResults);
    setSubmitted(true);
  }

  return (
    <main className="min-h-dvh md:flex md:justify-center md:px-10 md:py-30">
      <div className="md:flex md:w-full md:max-w-4xl md:bg-white md:rounded-2xl md:overflow-hidden">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="px-6 py-8 bg-white md:w-1/2"
        >
          <header className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
            <h1 className="font-bold text-xl text-slate-900">
              Mortgage Calculator
            </h1>
            <button
              type="button"
              onClick={clearAll}
              className="underline underline-offset-2 text-slate-500"
            >
              Clear All
            </button>
          </header>
          <section className="mt-6 flex flex-col gap-4 md:mt-8">
            <FormInput
              label="Mortgage Amount"
              name="mortgageAmount"
              id="mortgage-amount"
              value={formData.mortgageAmount}
              error={errors.mortgageAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              prefix="£"
            />
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:min-w-0 md:flex-1">
                <FormInput
                  label="Mortgage Term"
                  name="mortgageTerm"
                  id="mortgage-term"
                  value={formData.mortgageTerm}
                  error={errors.mortgageTerm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  suffix="years"
                />
              </div>
              <div className="md:min-w-0 md:flex-1">
                <FormInput
                  label="Interest Rate"
                  name="interestRate"
                  id="interest-rate"
                  value={formData.interestRate}
                  error={errors.interestRate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  suffix="%"
                />
              </div>
            </div>
          </section>
          <fieldset
            aria-invalid={Boolean(errors.mortgageType)}
            aria-describedby={
              errors.mortgageType ? "mortgage-type-error" : undefined
            }
            className="mt-6 flex flex-col gap-3"
          >
            <legend className="mb-2 text-slate-500">Mortgage Type</legend>
            <label className="flex flex-1 items-center gap-4 px-4 py-2 rounded-sm font-bold text-slate-900 outline-1 outline-slate-900 focus-within:outline-lime focus-within:bg-lime/20 hover:cursor-pointer">
              <input
                name="mortgageType"
                type="radio"
                value="repayment"
                checked={formData.mortgageType === "repayment"}
                onChange={handleChange}
                className="outline-none accent-radio-lime"
              />
              Repayment
            </label>
            <label className="flex flex-1 items-center gap-4 px-4 py-2 rounded-sm font-bold text-slate-900 outline-1 outline-slate-900 focus-within:outline-lime focus-within:bg-lime/20 hover:cursor-pointer">
              <input
                name="mortgageType"
                type="radio"
                value="interestOnly"
                checked={formData.mortgageType === "interestOnly"}
                onChange={handleChange}
                className="outline-none accent-radio-lime"
              />
              Interest Only
            </label>
            {errors.mortgageType && (
              <span id="mortgage-type-error" className="text-red">
                {errors.mortgageType}
              </span>
            )}
          </fieldset>
          <button
            type="submit"
            className="mt-6 flex justify-center w-full py-4 rounded-4xl font-bold text-slate-900 bg-lime hover:cursor-pointer hover:bg-lime/50 md:w-3/4 md:mt-10"
          >
            <div className="flex gap-2">
              <img src={calculatorIcon} alt="" />
              <span>Calculate Repayments</span>
            </div>
          </button>
        </form>
        <section
          className={`bg-slate-900 md:w-1/2 md:rounded-bl-[4rem] md:flex md:flex-col ${!submitted ? "md:justify-center" : ""} `}
        >
          {!submitted ? (
            <div className="flex flex-col gap-4 items-center">
              <img className="mt-6" src={emptyIllustration} alt="" />
              <h2 className="text-xl font-bold text-white">
                Results shown here
              </h2>
              <p className="mb-6 text-center text-sm px-5 text-slate-300 md:px-16">
                Complete the form and click “calculate repayments” to see what
                your monthly repayments would be.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 px-8">
              <h2 className="mt-6 text-xl font-bold text-white md:mt-8">
                Your results
              </h2>
              <p className="text-sm text-slate-300">
                Your results are shown below based on the information you
                provided. To adjust the results, edit the form and click
                “calculate repayments” again.
              </p>
              <div className="flex flex-col gap-6 px-4 py-4 rounded-sm border-t-2 border-white bg-[#0e2431] md:gap-20 md:py-6 md:mt-6">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-300">
                    Your monthly repayments
                  </span>
                  <span className="text-2xl font-bold text-lime md:text-6xl">
                    &pound;
                    {results.monthlyPayment.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-300">
                    Total you'll repay over the term
                  </span>
                  <span className="mb-2 text-white md:text-2xl">
                    &pound;
                    {results.totalRepayment.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
