import { useEffect, useState } from "react";
import "./projectPage.css"
import { useParams } from "react-router-dom"
import { runApi } from "../helper";
import { type ProjectType } from '../projectType'


export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectType>(); 

  useEffect(() => {
    const runGetApi = async () => {
      const resApi = await runApi(`/api/getProject/${projectId}`, "GET");
      setProject(resApi);
    }
    runGetApi();
  },[])

  const contentComponent = (
    <>
      <div>Hello world {project?.name}, { project?.projectId} </div>
    </>
  )
  return contentComponent
}