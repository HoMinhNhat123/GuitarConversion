import { useEffect, useState } from "react";
import "./projectPage.css"
import { useParams } from "react-router-dom"
import { runBasicApi } from "../helper";
import { type ProjectType } from '../projectType'


export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectType>(); 


  /*
   Run get API -> return package,json under .GuitarConversion/{projectId}
   */
  useEffect(() => {
    const runEffect = async () => {
      const resApi = await runBasicApi(`/api/getProject/${projectId}`, "GET");
      setProject(resApi);
    }
    runEffect();
  }, [])
  
  /*
    input event handler
    upon running call API -> create a pdf file under .GuitarConversion/:projectId
  */
  const onFile = async (file: File | null) => {
    try {
      const form = new FormData();
      if (file) form.append('file', file);

      const apiRes = await fetch(`/api/${projectId}/newPdf`, {
        method: "POST",
        headers: {}, 
        body: form
      })

      if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({}));
        throw new Error(err.error || err.hint || `HTTP ${apiRes.status}`);
      }
    } catch (e) {
      console.log("error at projectPage.tsx onFile function, check it? ")
    }
  }

  const contentComponent = (
    <>
      <div>Hello world {project?.name}, {project?.projectId} </div>
      
      <div>
        <div> Music sheet </div>
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => { onFile(e.target.files?.[0] ?? null)}}
          />
        </div>
      </div>
    </>
  )
  return contentComponent
}