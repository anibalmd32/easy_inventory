import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdCheckCircleOutline } from "react-icons/md";
import { useUserStore } from "../../stores/useUserStore";
import { RecoveryAnswerStep } from "./steps/RecoveryAnswerStep";
import {
  type FoundAccount,
  RecoveryEmailStep,
} from "./steps/RecoveryEmailStep";
import { RecoveryResetStep } from "./steps/RecoveryResetStep";

type RecoveryState =
  | {
      step: "email";
    }
  | {
      step: "answer";
      account: FoundAccount;
    }
  | {
      step: "reset";
      account: FoundAccount;
      answer: string;
    }
  | {
      step: "done";
    };

const STEP_ORDER = [
  "email",
  "answer",
  "reset",
] as const;

export const PasswordRecoveryForm = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<RecoveryState>({
    step: "email",
  });
  const resetFailedLogins = useUserStore((store) => store.resetFailedLogins);

  // El índice del paso "done" se queda en el último para que la barra se vea
  // completa al terminar.
  const currentIndex =
    state.step === "done"
      ? STEP_ORDER.length
      : STEP_ORDER.indexOf(state.step as (typeof STEP_ORDER)[number]);

  if (state.step === "done") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MdCheckCircleOutline className="text-success" size={48} />
        <h2 className="text-lg font-semibold">
          {t("pages.auth.recover.successTitle")}
        </h2>
        <p className="text-sm opacity-70">
          {t("pages.auth.recover.successMessage")}
        </p>
        <Link className="btn btn-primary btn-block" to="/auth">
          {t("buttons.backToLogin.label")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <ul className="steps w-full text-xs">
        {STEP_ORDER.map((step, index) => (
          <li
            className={index <= currentIndex ? "step step-primary" : "step"}
            key={step}
          >
            {t(`pages.auth.recover.steps.${step}`)}
          </li>
        ))}
      </ul>

      {state.step === "email" ? (
        <RecoveryEmailStep
          onFound={(account) =>
            setState({
              step: "answer",
              account,
            })
          }
        />
      ) : null}

      {state.step === "answer" ? (
        <RecoveryAnswerStep
          onVerified={(answer) =>
            setState({
              step: "reset",
              account: state.account,
              answer,
            })
          }
          questionKey={state.account.questionKey}
          userId={state.account.userId}
        />
      ) : null}

      {state.step === "reset" ? (
        <RecoveryResetStep
          answer={state.answer}
          onDone={() => {
            // Recuperó el acceso, así que el contador que destapó este enlace
            // vuelve a cero. No se toca `rememberedEmail`: activarlo aquí
            // dejaría marcada una casilla que el usuario nunca eligió.
            resetFailedLogins();
            setState({
              step: "done",
            });
          }}
          userId={state.account.userId}
        />
      ) : null}

      <Link className="link mt-2 self-center text-sm" to="/auth">
        {t("buttons.backToLogin.label")}
      </Link>
    </div>
  );
};
