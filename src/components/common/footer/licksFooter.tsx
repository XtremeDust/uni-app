'use client'
import Redes from "@/components/common/footer/socialMedia";
import {sectionFs} from "@/types/footerSection";

function licksFooter(){
    return(
    <div className="lg:grid grid-flow-col col-span-4 gap-5 p-8 ml-7 hidden text-white">
        {sectionFs.map((section)=>(
            <ul key={section.id} >
                <a href={section.url} className="font-bold">
                    {section.title}
                </a>
                {section.subsection?.map((sub)=>(                            
                    <li key={sub.id} className="mt-3">
                        {sub.id!==43 &&(
                        <a href={sub.url}>
                            {sub.title}
                        </a>
                        )}
                            {sub.id===43 &&(
                            <div>
                                <p>{sub.title}</p>
                               <div className="grid gap-1 justify-start mt-4">
                                    <Redes />
                                </div>
                            </div>
                            )}
                    </li>
                ))}                    
            </ul>
        ))}              
    </div>
    )
}

export default licksFooter;