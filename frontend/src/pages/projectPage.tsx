import { useEffect, useState } from "react";
import "./projectPage.css"
import { useParams } from "react-router-dom"
import { runBasicApi } from "../helper";
import { type ProjectType } from '../projectType'

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectType>(); 
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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
    Run /api/{projectId}/{pdfId} which returns a pdf file
    ingest pdf file onto UI
   */
  useEffect(() => {
    if (!pdfId) return;

    // calling API 
    let objectUrl: string;
    const runEffect = async () => {
      const apiRes = await fetch(`/api/${projectId}/${pdfId}`);
      const blob = await apiRes.blob();
      objectUrl = URL.createObjectURL(blob);
      setPdfUrl(objectUrl);
    }
    runEffect();

    // cleanup url to avoid memory leak 
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  },[pdfId]);
  
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

      const out = await apiRes.json();
      setPdfId(out.fileId);
    } catch (e) {
      console.log("error at projectPage.tsx onFile function, check it? ")
    }
  }

  const contentComponent = (
    <>
      <div>Hello world {project?.name}, {project?.projectId} </div>
    
      <div> Music sheet </div>
      <div>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => { onFile(e.target.files?.[0] ?? null)}}
        />
      </div>
      
      {/* pdf viewer */}
      {pdfUrl ? (
        <iframe src={ pdfUrl }  style={{ width: "100%", height: "80vh", border: "none" }}/>
      ): <div>No pdf here sad</div>}
      
    </>
  )
  return contentComponent
}