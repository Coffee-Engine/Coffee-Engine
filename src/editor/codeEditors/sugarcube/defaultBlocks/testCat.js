(function () {
    const blockTypesBlocks = [];
    const argumentTypeBlocks = [];

    Object.keys(sugarcube.BlockType).forEach((type) => {
        blockTypesBlocks.push({
            opcode: type,
            type: sugarcube.BlockType[type],
            text: type,
        });
    });

    Object.keys(sugarcube.ArgumentType).forEach((type) => {
        argumentTypeBlocks.push({
            opcode: type + "_Arg",
            type: sugarcube.BlockType.COMMAND,
            text: type + "[argument]",
            arguments: {
                argument: {
                    type: sugarcube.ArgumentType[type],
                },
            },
        });
    });

    class testCategory {
        getInfo() {
            return {
                name: "TEST",
                id: "test",
                color1: "#ff0000",
                color2: "#00ff00",
                color3: "#0000ff",
                blocks: ["Block Types"]
                    .concat(blockTypesBlocks)
                    .concat(["Argument Types"])
                    .concat(argumentTypeBlocks)
                    .concat([
                        "Static Menus",
                        {
                            opcode: "staticMenuNoRep",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "staticNoREP",
                                },
                            },
                        },
                        {
                            opcode: "staticMenu",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (NO REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "static",
                                },
                            },
                        },
                        "---",
                        {
                            opcode: "staticMenuJSONNOREP",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (JSON NO REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "staticJSONNOREP",
                                },
                            },
                        },
                        {
                            opcode: "staticMenuJSON",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (JSON REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "staticJSON",
                                },
                            },
                        },
                        "---",
                        {
                            opcode: "staticMenuArrayNOREP",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (ARRAY NO REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "staticArrayNOREP",
                                },
                            },
                        },
                        {
                            opcode: "staticMenuArray",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (ARRAY REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "staticArray",
                                },
                            },
                        },
                        "---",
                        {
                            opcode: "staticMenuMixedNOREP",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (MIXED NO REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "mixedBlocksNOREP",
                                },
                            },
                        },
                        {
                            opcode: "staticMenuMixed",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Static Menu [Menu1] (MIXED REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "mixedBlocks",
                                },
                            },
                        },
                        "Dynamic Menus",
                        {
                            opcode: "dynamicMenuNOREP",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Dynamic Menu [Menu1] (NO REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "dynamicMenuNOREP",
                                },
                            },
                        },
                        {
                            opcode: "dynamicMenu",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Dynamic Menu [Menu1] (REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "dynamicMenu",
                                },
                            },
                        },
                        {
                            opcode: "dynamicMenuMixed",
                            type: sugarcube.BlockType.COMMAND,
                            text: "Dynamic Menu [Menu1] (REPORTER) [Menu2] (REPORTER)",
                            arguments: {
                                Menu1: {
                                    menu: "dynamicMenu",
                                },
                                Menu2: {
                                    menu: "dynamicMenuNOREP",
                                },
                            },
                        },
                        {
                            opcode: "rLongOBJ",
                            type: sugarcube.BlockType.OBJECT,
                            text: "like a really long object block, Like a REALLY long one with an object input [obj]",
                            arguments: {
                                obj: {
                                    type: sugarcube.ArgumentType.OBJECT,
                                },
                            },
                        },
                        {
                            opcode: "rLongARRAY",
                            type: sugarcube.BlockType.ARRAY,
                            text: "like a really long ARRAY block, Like a REALLY long one with an ARRAY input [obj]",
                            arguments: {
                                obj: {
                                    type: sugarcube.ArgumentType.ARRAY,
                                },
                            },
                        },
                        {
                            opcode: "mutatedBlock",
                            type: sugarcube.BlockType.HAT,
                            text: "mutatorTest",
                            mutator: "mutatorTest",
                        },
                        {
                            opcode: "doomBlock",
                            type: sugarcube.BlockType.HAT,
                            text: "Doom [doom]",
                            arguments: {
                                doom: {
                                    type: sugarcube.ArgumentType.CUSTOM,
                                    customType:"doomField"
                                }
                            }
                        },
                    ]),
                menus: {
                    staticNoREP: {
                        items: ["Item1", "Item2", "Item3"],
                    },
                    static: {
                        acceptReporters: true,
                        items: ["Item1", "Item2", "Item3"],
                    },
                    staticJSON: {
                        acceptReporters: true,
                        items: [
                            { text: "Text1", value: "Item1" },
                            { text: "Text2", value: "Item2" },
                            { text: "Text3", value: "Item3" },
                            { text: "Text4", value: "Item4" },
                            { text: "Text5", value: "Item5" },
                        ],
                    },
                    staticArray: {
                        acceptReporters: true,
                        items: [
                            ["Text1", "Item1"],
                            ["Text2", "Item2"],
                            ["Text3", "Item3"],
                            ["Text4", "Item4"],
                            ["Text5", "Item5"],
                        ],
                    },

                    staticJSONNOREP: {
                        acceptReporters: false,
                        items: [
                            { text: "Text1", value: "Item1" },
                            { text: "Text2", value: "Item2" },
                            { text: "Text3", value: "Item3" },
                            { text: "Text4", value: "Item4" },
                            { text: "Text5", value: "Item5" },
                        ],
                    },
                    staticArrayNOREP: {
                        acceptReporters: false,
                        items: [
                            ["Text1", "Item1"],
                            ["Text2", "Item2"],
                            ["Text3", "Item3"],
                            ["Text4", "Item4"],
                            ["Text5", "Item5"],
                        ],
                    },
                    mixedBlocksNOREP: {
                        acceptReporters: false,
                        items: [["Array", "Item1"], { text: "JSON", value: "Item2" }, "String"],
                    },
                    mixedBlocks: {
                        acceptReporters: true,
                        items: [["Array", "Item1"], { text: "JSON", value: "Item2" }, "String"],
                    },
                    dynamicMenuNOREP: {
                        acceptReporters: false,
                        items: "dynamicMenuFunc",
                    },
                    dynamicMenu: {
                        acceptReporters: true,
                        items: "dynamicMenuFunc",
                    },
                },
                mutators: {
                    mutatorTest: {
                        serialize:"test_Serialize",
                        deserialize:"test_Deserialize"
                    }
                },
                fields: {
                    //fieldTest: {
                    //    isDropdown:true,
                    //    
                    //    //Our custom editor
                    //    editor:"test_Editor",
                    //
                    //    color1:"#ef0000",
                    //    color2:"#af101a",
                    //
                    //    //If we want a custom validator
                    //    validate:"test_Validate",
                    //
                    //    //Just in case we want to edit how the field is rendered
                    //    render:"test_Render"
                    //    initilize:"test_Init"
                    //}
                    doomField: {
                        isDropdown:true,
                        initilize:"doom_render",
                        sizeOverride:[650,410],

                        color1:"#ef0000",
                        color2:"#af101a",
                    }
                }
            };
        }

        dynamicMenuFunc() {
            return [
                ["this works", "works"],
                ["for realsies", "for"],
            ].concat([[`${Date.now()}`, "time"]]);
        }

        //our functions for our mutator
        test_Serialize(state, block) {
            return state;
        }

        test_Deserialize(state, block) {
            return state;
        }

        doom_render(field) {
            field.createForeignObject_(640,480);

            const iFrame = document.createElement("iframe");

            field.foreignObject_.appendChild(iFrame);
            
            iFrame.width = 650;
            iFrame.height = 410;
            
            //iFrame.src = "https://silentspacemarine.com/";
            iFrame.srcdoc = atob(`PCEtLSBPUklHSU5BTDogaHR0cHM6Ly9kaWVrbWFubi5naXRodWIuaW8vd2FzbS1maXp6YnV6ei9kb29tLyAtLT48IWRvY3R5cGVodG1sPjxodG1sPjxib2R5PjxET09NPjxzdHlsZT4jb3V0cHV0e2JvcmRlcjozcHggZ3Jvb3ZlICM3ZmZmZDQ7YmFja2dyb3VuZC1jb2xvcjpiaXNxdWU7d2lkdGg6NTUwcHg7aGVpZ2h0OjQwMHB4O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtmb250LXNpemU6MTBweDtvdmVyZmxvdy15OnNjcm9sbH0jb3V0cHV0IHNwYW4ubG9ne2NvbG9yOiM0ODNkOGJ9I291dHB1dCBzcGFuLnN0ZG91dHtjb2xvcjojMDAwfSNvdXRwdXQgc3Bhbi5zdGRlcnJ7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOmJyb3dufS5jb250YWluZXJ7ZGlzcGxheTpmbGV4fSp7bWFyZ2luOjBweDtwYWRkaW5nOjBweH08L3N0eWxlPjxzcGFuIGhpZGRlbj48cCBpZD1mb2N1c2hpbnQ+PC9wPjxwPjxidXR0b24gaWQ9ZW50ZXJCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1sZWZ0QnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9dXBCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1kb3duQnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9cmlnaHRCdXR0b24+PC9idXR0b24+IDxidXR0b24gaWQ9Y3RybEJ1dHRvbj48L2J1dHRvbj48YnV0dG9uIGlkPXNwYWNlQnV0dG9uPjwvYnV0dG9uPiA8YnV0dG9uIGlkPWFsdEJ1dHRvbj48L2J1dHRvbj48L3A+PC9zcGFuPjxkaXYgY2xhc3M9Y29udGFpbmVyPjxjYW52YXMgaGVpZ2h0PTQwMCBpZD1zY3JlZW4gdGFiaW5kZXg9MCB3aWR0aD02NDA+VGhpcyBpcyB3aGVyZSB0aGUgRG9vTSBzY3JlZW4gc2hvdWxkIHJlbmRlci48L2NhbnZhcz48ZGl2IGhpZGRlbiBpZD1vdXRwdXQ+PC9kaXY+PC9kaXY+PHNwYW4gaGlkZGVuPjxzcGFuIGlkPWdldG1zcHNfc3RhdHM+PC9zcGFuPjxzcGFuIGlkPWdldG1zX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9ZnBzX3N0YXRzPjwvc3Bhbj48c3BhbiBpZD1kcmF3ZnJhbWVzX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9YW5pbWF0aW9uZnBzX3N0YXRzPjwvc3Bhbj48L3NwYW4+PHNjcmlwdCBkZWZlcj4idXNlIHN0cmljdCI7dmFyIG1lbW9yeT1uZXcgV2ViQXNzZW1ibHkuTWVtb3J5KHtpbml0aWFsOjEwOH0pO2NvbnN0IG91dHB1dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgib3V0cHV0Iik7ZnVuY3Rpb24gcmVhZFdhc21TdHJpbmcodCxlKXtsZXQgbj1uZXcgVWludDhBcnJheShtZW1vcnkuYnVmZmVyLHQsZSk7cmV0dXJuIG5ldyBUZXh0RGVjb2RlcigidXRmOCIpLmRlY29kZShuKX1mdW5jdGlvbiBjb25zb2xlTG9nU3RyaW5nKHQsZSl7bGV0IG49cmVhZFdhc21TdHJpbmcodCxlKTtjb25zb2xlLmxvZygnIicrbisnIicpfWZ1bmN0aW9uIGFwcGVuZE91dHB1dCh0KXtyZXR1cm4gZnVuY3Rpb24oZSxuKXtsZXQgcz1yZWFkV2FzbVN0cmluZyhlLG4pLnNwbGl0KCJcbiIpO2Zvcih2YXIgYT0wO2E8cy5sZW5ndGg7KythKWlmKDAhPXNbYV0ubGVuZ3RoKXt2YXIgcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzcGFuIik7ci5jbGFzc0xpc3QuYWRkKHQpLHIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc1thXSkpLG91dHB1dC5hcHBlbmRDaGlsZChyKSxvdXRwdXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYnIiKSksci5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6InNtb290aCIsYmxvY2s6ImVuZCIsaW5saW5lOiJuZWFyZXN0In0pfX19Y29uc3QgZ2V0bXNwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZ2V0bXNwc19zdGF0cyIpLGdldG1zX3N0YXRzPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJnZXRtc19zdGF0cyIpO3ZhciBnZXRtc19jYWxsc190b3RhbD0wLGdldG1zX2NhbGxzPTA7ZnVuY3Rpb24gZ2V0TWlsbGlzZWNvbmRzKCl7cmV0dXJuKytnZXRtc19jYWxscyxwZXJmb3JtYW5jZS5ub3coKX13aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtnZXRtc19jYWxsc190b3RhbCs9Z2V0bXNfY2FsbHMsZ2V0bXNwc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHMvMWUzKyJrIixnZXRtc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHNfdG90YWwsZ2V0bXNfY2FsbHM9MH0sMWUzKTtjb25zdCBjYW52YXM9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNjcmVlbiIpLGRvb21fc2NyZWVuX3dpZHRoPTY0MCxkb29tX3NjcmVlbl9oZWlnaHQ9NDAwLGZwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZnBzX3N0YXRzIiksZHJhd2ZyYW1lc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZHJhd2ZyYW1lc19zdGF0cyIpO3ZhciBudW1iZXJfb2ZfZHJhd3NfdG90YWw9MCxudW1iZXJfb2ZfZHJhd3M9MDtmdW5jdGlvbiBkcmF3Q2FudmFzKHQpe3ZhciBlPW5ldyBVaW50OENsYW1wZWRBcnJheShtZW1vcnkuYnVmZmVyLHQsMTAyNGUzKSxuPW5ldyBJbWFnZURhdGEoZSw2NDAsNDAwKTtjYW52YXMuZ2V0Q29udGV4dCgiMmQiKS5wdXRJbWFnZURhdGEobiwwLDApLCsrbnVtYmVyX29mX2RyYXdzfXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe251bWJlcl9vZl9kcmF3c190b3RhbCs9bnVtYmVyX29mX2RyYXdzLGRyYXdmcmFtZXNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3c190b3RhbCxmcHNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3cyxudW1iZXJfb2ZfZHJhd3M9MH0sMWUzKTt2YXIgaW1wb3J0T2JqZWN0PXtqczp7anNfY29uc29sZV9sb2c6YXBwZW5kT3V0cHV0KCJsb2ciKSxqc19zdGRvdXQ6YXBwZW5kT3V0cHV0KCJzdGRvdXQiKSxqc19zdGRlcnI6YXBwZW5kT3V0cHV0KCJzdGRlcnIiKSxqc19taWxsaXNlY29uZHNfc2luY2Vfc3RhcnQ6Z2V0TWlsbGlzZWNvbmRzLGpzX2RyYXdfc2NyZWVuOmRyYXdDYW52YXN9LGVudjp7bWVtb3J5Om1lbW9yeX19O1dlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKGZldGNoKCJodHRwczovL3N1cnYuaXMtYS5kZXYvZG9vbS53YXNtIiksaW1wb3J0T2JqZWN0KS50aGVuKHQ9Pnt0Lmluc3RhbmNlLmV4cG9ydHMubWFpbigpO2xldCBlPWZ1bmN0aW9uKHQpe3N3aXRjaCh0KXtjYXNlIDg6cmV0dXJuIDEyNztjYXNlIDE3OnJldHVybiAxNTc7Y2FzZSAxODpyZXR1cm4gMTg0O2Nhc2UgMzc6cmV0dXJuIDE3MjtjYXNlIDM4OnJldHVybiAxNzM7Y2FzZSAzOTpyZXR1cm4gMTc0O2Nhc2UgNDA6cmV0dXJuIDE3NTtkZWZhdWx0OmlmKHQ+PTY1JiZ0PD05MClyZXR1cm4gdCszMjtpZih0Pj0xMTImJnQ8PTEyMylyZXR1cm4gdCs3NTtyZXR1cm4gdH19LG49ZnVuY3Rpb24oZSl7dC5pbnN0YW5jZS5leHBvcnRzLmFkZF9icm93c2VyX2V2ZW50KDAsZSl9LHM9ZnVuY3Rpb24oZSl7dC5pbnN0YW5jZS5leHBvcnRzLmFkZF9icm93c2VyX2V2ZW50KDEsZSl9O2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCJrZXlkb3duIixmdW5jdGlvbih0KXtuKGUodC5rZXlDb2RlKSksdC5wcmV2ZW50RGVmYXVsdCgpfSwhMSksY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoImtleXVwIixmdW5jdGlvbih0KXtzKGUodC5rZXlDb2RlKSksdC5wcmV2ZW50RGVmYXVsdCgpfSwhMSksW1siZW50ZXJCdXR0b24iLDEzXSxbImxlZnRCdXR0b24iLDE3Ml0sWyJyaWdodEJ1dHRvbiIsMTc0XSxbInVwQnV0dG9uIiwxNzNdLFsiZG93bkJ1dHRvbiIsMTc1XSxbImN0cmxCdXR0b24iLDE1N10sWyJzcGFjZUJ1dHRvbiIsMzJdLFsiYWx0QnV0dG9uIiwxODRdXS5mb3JFYWNoKChbdCxlXSk9Pntjb25zb2xlLmxvZyh0KyIgZm9yICIrZSk7dmFyIGE9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodCk7YS5hZGRFdmVudExpc3RlbmVyKCJ0b3VjaHN0YXJ0IiwoKT0+bihlKSksYS5hZGRFdmVudExpc3RlbmVyKCJ0b3VjaGVuZCIsKCk9PnMoZSkpLGEuYWRkRXZlbnRMaXN0ZW5lcigidG91Y2hjYW5jZWwiLCgpPT5zKGUpKX0pO2xldCBhPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJmb2N1c2hpbnQiKSxyPWZ1bmN0aW9uKHQpe2EuaW5uZXJUZXh0PSJLZXlib2FyZCBldmVudHMgd2lsbCBiZSBjYXB0dXJlZCBhcyBsb25nIGFzIHRoZSB0aGUgRE9PTSBjYW52YXMgaGFzIGZvY3VzLiIsYS5zdHlsZS5mb250V2VpZ2h0PSJub3JtYWwifTtjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigiZm9jdXNpbiIsciwhMSksY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoImZvY3Vzb3V0IixmdW5jdGlvbih0KXthLmlubmVyVGV4dD0iQ2xpY2sgb24gdGhlIGNhbnZhcyB0byBjYXB1dGUgaW5wdXQgYW5kIHN0YXJ0IHBsYXlpbmcuIixhLnN0eWxlLmZvbnRXZWlnaHQ9ImJvbGQifSwhMSksY2FudmFzLmZvY3VzKCkscigpO2xldCBvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhbmltYXRpb25mcHNfc3RhdHMiKTt2YXIgdT0wO2Z1bmN0aW9uIGMoZSl7Kyt1LHQuaW5zdGFuY2UuZXhwb3J0cy5kb29tX2xvb3Bfc3RlcCgpLHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYyl9d2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCl7by5pbm5lclRleHQ9dSx1PTB9LDFlMyksd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjKX0pOzwvc2NyaXB0PjwvRE9PTT48L2JvZHk+PC9odG1sPg==`);
        }
    }

    sugarcube.extensionManager.registerExtension(new testCategory());
})();
