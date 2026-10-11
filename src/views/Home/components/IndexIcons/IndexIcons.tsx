import type { Icon } from "../../../../types";


type IconProps = {
  icon: Icon
};

export default function IndexIcons({ icon }: IconProps) {
  return (
    <article className=" group rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl">
      <div className="flex justify-center">
        <div className=" flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-950 transition-transform duration-300 group-hover:scale-105">
          <img
            className="h-10 w-10 brightness-0 invert"
            src={icon.image}
            alt={icon.title}
          />
        </div>

      </div>

      <h2 className="mt-6 text-xl font-semibold text-zinc-900">
        {icon.title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-zinc-500">
        {icon.text}
      </p>

    </article>
  );
}