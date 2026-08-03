import { useNavigate } from 'react-router-dom'
import './mainCanvas.css'
import { useEffect, useState } from 'react'
import { type ProjectType } from '../type'



/**
 * @param ApiEndpoint
 * @returns json result   
 */
const runApi = async (endpoint: string, method: string) => {
  const apiRes = await fetch(endpoint, { method: method });

  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => ({}));
    throw new Error(err.error || err.hint || `HTTP ${apiRes.status}`);
  }

  const out = await apiRes.json();
  return out
}


export function MainCanvas() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const navigate = useNavigate();

  // get all the projects under .GuitarConversion/
  // run when the UI is first loaded
  useEffect(() => {
    const runGetApi = async () => {
      // out will be an array of ProjectType
      const out = await runApi("/api/getProjects", "GET");
      setProjects(out)

    };

    runGetApi();
  }, [])

  /**
   * Call newProject POST api 
   * create a new project in /.GuitarConversion (with a valid uuid)
   */
  const onNewProject = async () => {
    const out = await runApi("/api/newProject", "POST");
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