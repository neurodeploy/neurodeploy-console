/* @refresh reload */
import { render } from "solid-js/web";
import { Router, A } from "@solidjs/router";
import { icons } from "../assets/icons";
import { clickOutside } from "./components/Modals";
import { user, grabfromCache, logUserOut } from "./store/user";
import { location } from "./store/location";
import { modal, modalNull, setModal } from "./store/modal";
import { DOMAIN_NAME } from "./params/params";
import Login from "./pages/Login";
import logoUrl from "../assets/logo.png";

import "./index.css";
import App from "./App";
import Nav from "./components/Nav";
import { createEffect, createSignal } from "solid-js";
const [showMenu, setShowMenu] = createSignal(false);
const toggleShowMenu = () => setShowMenu((prev) => !prev);

const navItems = [
  {
    name: "Models",
    icon: icons.models,
    link: "/models",
    show: true,
    click: null,
  },
  {
    name: "API Keys",
    icon: icons.apiKeys,
    link: "/api-keys",
    show: true,
    click: null,
  },
  {
    name: "Credentials",
    icon: icons.settings,
    link: "/credentials",
    show: true,
    click: null,
  },
  {
    name: "Logout",
    icon: icons.logout,
    link: "/",
    show: true,
    click: () => logUserOut(),
  },
];

const Logo = () => (
  <div class="text-2xl sm:text-3xl">
    <A href="/" class="flex justify-between items-center space-x-3">
      <img
        src={logoUrl}
        alt="Neurodeploy logo"
        class="w-8 sm:w-12 ml-0 md:ml-2"
      />
      <span>Neurodeploy</span>
    </A>
  </div>
);

// Log out user from all tabs if logged out from one
setInterval(() => {
  const cached = grabfromCache();
  if (!user().expires) return;

  const now = new Date();
  const expires_on = new Date(user().expires);

  if (!cached && user().loggedIn) {
    logUserOut();
  } else if (expires_on <= now) {
    logUserOut();
  }
}, 1000);

createEffect(() => {
  if (modal().visible) {
    console.log("modal().visible");
    document.getElementById("root").style.opacity = 0.5;
  } else {
    console.log("not modal().visible");
    document.getElementById("root").style.opacity = 1;
  }
});

const NavItems = () => (
  <div class="">
    <ul class="flex flex-col items-end md:hidden md:display-none">
      <For each={navItems}>
        {(item) => (
          <A
            class="hover:underline transition-transform hover:bg-zinc-700 w-full px-5 py-4 text-right"
            classList={{
              "bg-zinc-700 font-semibold bg-opacity-80":
                location() == item.name,
            }}
            href={item.link}
            onClick={(e) => {
              item.click ? item.click(e) : setShowMenu(false);
            }}
          >
            <span class="">{item.name}</span>
          </A>
        )}
      </For>
    </ul>
  </div>
);

const NavExpanded = () => {
  return (
    <>
      <div
        class="flex flex-col lg:hidden cursor-pointer p-0"
        onClick={toggleShowMenu}
        use:clickOutside={() => setShowMenu(false)}
        tabIndex="0"
        onKeyDown={(e) => {
          // if they hit space or enter
          if (e.code === "Space" || e.code === "Enter") {
            const x = e.target;
            x.click();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.2"
          stroke="currentColor"
          class="w-8 h-8 sm:w-10 sm:h-10"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <ul class="space-x-8 hidden lg:flex">
        <For each={navItems}>
          {(item) => {
            if (item.show) {
              return (
                <li>
                  <A
                    class="hover:text-violet-700 hover:underline transition-transform"
                    classList={{
                      "text-violet-700 underline": location() == item.name,
                    }}
                    href={item.link}
                  >
                    {item.name}
                  </A>
                </li>
              );
            }
          }}
        </For>
      </ul>
    </>
  );
};

render(
  () => (
    <Router>
      <Show when={user().loggedIn} fallback={() => Login()}>
        {/* Header */}
        <header
          class="flex flex-row items-center justify-between h-20 p-4 bg-transparent border-b-2 border-zinc-700"
          classList={{ "opacity-[85%]": modal().visible }}
        >
          <Logo />
          <h2 class="hidden md:inline pr-4">Welcome, {user().username}!</h2>
          {/* Collapsible nav menu */}
          <nav class="flex pt-1 pr-0 md:pr-6 w-full justify-end items-center md:hidden">
            <NavExpanded />
          </nav>
        </header>

        <Show when={showMenu()}>
          {/* <h2 class="md:hidden text-right p-4">Welcome, {user().username}!</h2> */}
          <div class="w-full flex flex-col justify-end">
            <NavItems />
          </div>
        </Show>

        {/* Center */}
        <div
          className="flex h-full bg-transparent overflow-y-auto md:overflow-y-hidden"
          classList={{ "opacity-[85%]": modal().visible }}
        >
          <div
            class="md:grid md:grid-cols-[15rem_1fr] w-full"
            classList={{ hidden: showMenu() }}
          >
            {/* SideNav */}
            <nav class="hidden md:flex flex-col justify-between p-6 bg-transparent border-r-2 border-zinc-700 col-span-1 ">
              <Nav />
            </nav>

            {/* Main */}
            <main className="w-full h-full p-4 md:p-12 col-span-1 overflow-y-auto">
              <App />
            </main>
          </div>
        </div>
      </Show>

      {/* Footer */}
      <footer
        class="flex flex-row items-center justify-between h-12 p-4 md:px-6 text-gray-400 bg-transparent border-t-2 border-zinc-700"
        classList={{ "opacity-[85%]": modal().visible }}
      >
        <div class="md:mx-4">Copyright &copy; 2023 Neurodeploy</div>
        {/* Terms and Conditions */}
        <div class="flex items-center md:mx-4 space-x-2 ">
          <a class="underline" href={`${DOMAIN_NAME}/terms`}>
            terms
          </a>
          <a class="sm:hidden underline" href={`${DOMAIN_NAME}/privacy`}>
            privacy
          </a>
          <a class="hidden sm:inline underline" href={`${DOMAIN_NAME}/privacy`}>
            privacy policy
          </a>
        </div>
      </footer>
    </Router>
  ),
  document.getElementById("root")
);

// Modal
render(
  () => (
    <Show when={modal().visible}>
      <div
        id="modal-start"
        tabIndex="0"
        onKeyDown={(e) => {
          console.log("e.code: ", e.code);
          if (e.code === "Escape") {
            setModal(modalNull);
          }
        }}
      ></div>
      <div class="flex justify-center overflow-x-auto">{modal().content}</div>
    </Show>
  ),
  document.getElementById("modal")
);
