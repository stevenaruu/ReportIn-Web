const Header = ({ title, subheader }: { title: string; subheader?: string }) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl text-[#5d5d5d] font-bold">{title}</h1>
        {subheader && <p className="text-[#5d5d5d]">{subheader}</p>}
      </div>
      <div className="border-b border-b-[#5d5d5d] my-4" />
    </>
  )
}

export default Header