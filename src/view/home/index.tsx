import classNames from "classnames";
import * as Sentry from "@sentry/react";
import * as R from "ramda";
import style from "./index.module.scss";

function HomePage() {
  return (
    <div className={classNames(style.mainContainer, "beautiful-scrollbar")}>
    </div>
  );
}

export default Sentry.withErrorBoundary(HomePage, {
  fallback: (
    <p className="w-full h-full text-xl">
      Sorry, an unrecoverable error has occurred. Please reload the page.
    </p>
  ),
  showDialog: true,
});
