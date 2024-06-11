import Header from "./_components/Header"

function DashBoardlayout({ children }) {
  return (
    <div>
      <Header/>
      {children}
    </div>
  )
}

export default DashBoardlayout