import { useNavigate } from 'react-router-dom'
import './mainCanvas.css'
import { useEffect, useState } from 'react'
import { type ProjectType } from '../projectType'
import { runBasicApi } from '../helper'


export function MainCanvas() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const navigate = useNavigate();

  // get all the projects under .GuitarConversion/
  // run when the UI is first loaded
  useEffect(() => {
    const runEffect = async () => {
      // out will be an array of ProjectType
      const out = await runBasicApi("/api/getProjects", "GET");
      setProjects(out)

    };

    runEffect();
  }, [])

  /**
   * Call newProject POST api 
   * create a new project in /.GuitarConversion (with a valid uuid)
   */
  const onNewProject = async () => {
    const out = await runBasicApi("/api/newProject", "POST");
    setProjects([...projects, { projectId: out.projectId, name: "default project" }])
    console.log(projects);
  }

  // ---- UI ----
  const contentComponent = (
    <>
      <header className="topBar">
        <p> Guitar Conversion</p>
      </header>

      <main className="page">
        <div>
          <button
            type="button"
            onClick={onNewProject}
          >
            New Project
          </button>
        </div>

        <div className="projectRow">
          {projects.map((project) => (
            <div
              key={project.projectId}
              className="projectBox"
              onClick = {() => navigate(`/project/${project.projectId}`)}
            >
              {project.name}
            </div>
          ))}
        </div>
      </main>
    </>
  )

  return contentComponent
}