import React, { useContext } from 'react'
import { WorkflowContext } from '@/context/WorkflowContext';
import AgentSettings from './_NodeSettings/AgentSettings';
import EndSettings from './_NodeSettings/EndSettings';
import IfElseSetting from './_NodeSettings/IfElseSetting';
import WhileSetting from './_NodeSettings/WhileSetting';
import ApprovalSetting from './_NodeSettings/ApprovalSetting';
import ApiAgentSettings from './_NodeSettings/ApiAgentSettings';
import StartNode from './_NodeSettings/StartNode';

const SettingPanel = () => {
    const {selectedNode, setAddedNode} = useContext(WorkflowContext); 

    const onUpdateNodeData = (formData: any) => {
        setAddedNode((prevNodes: any) => {
            return prevNodes.map((node: any) => {
                if (node.id === selectedNode.id) {
                    
                    return {
                        ...node,
                        data: {
                            ...node.data,
                           
                            label: selectedNode?.type === 'AgentNode' 
                                ? (formData.name || node.data.label) 
                                : node.data.label,
                            settings: formData
                        }
                    }
                }
                return node;
            })
        })
    }

    return selectedNode && (
        <div className="glass-cyber border-2 border-[#00f2fe]/20 rounded-2xl shadow-[0_0_40px_rgba(0,242,254,0.15)] p-6 w-[380px] text-white">
            {selectedNode?.type == 'EndNode' && <EndSettings 
                selectedNode={selectedNode}
                updatedFormData={(value: any) => onUpdateNodeData(value)}
            />}
            {selectedNode?.type == 'AgentNode' && <AgentSettings 
                selectedNode={selectedNode}
                updatedFormData={(value: any) => onUpdateNodeData(value)}
            />}
            {selectedNode?.type == 'IfElseNode' && <IfElseSetting
                selectedNode={selectedNode}
                updatedFormData={(value: any) => onUpdateNodeData(value)}
            />}
            {selectedNode?.type == 'WhileNode' && <WhileSetting
                selectedNode={selectedNode}
                updatedFormData={(value: any) => onUpdateNodeData(value)}
            />}
            {selectedNode?.type == 'ApprovalNode' && <ApprovalSetting 
                selectedNode={selectedNode}
                updatedFormData={(value: any) => onUpdateNodeData(value)}
            />}
            {selectedNode?.type == 'ApiNode' && <ApiAgentSettings 
                selectedNode={selectedNode}
                updatedFormData={(value: any) => onUpdateNodeData(value)}
            />}
            {selectedNode?.id == 'start' && <StartNode/>}
        </div>
    )
}

export default SettingPanel