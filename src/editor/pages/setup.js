(function () {
    editor.setup = {
        scratchedSVG: `<svg class="layoutImage" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="71.91134"
            height="71.91134" viewBox="0,0,71.91134,71.91134">
            <g transform="translate(-204.04433,-144.04433)">
                <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-linecap="butt"
                    stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                    style="mix-blend-mode: normal">
                    <path
                        d="M209.2858,207.0396c0,-11.57945 0,-47.40122 0,-53.9301c0,-1.99676 1.2789,-3.76085 2.65749,-3.76085c4.83497,0 32.68821,0 32.68821,0v61.3027c0,0 -27.07811,0 -32.19338,0c-1.60067,0 -3.15232,-1.33887 -3.15232,-3.61175z"
                        fill="currentcolor" stroke-width="none" />
                    <path
                        d="M246.7035,210.65135v-34.45708h24.0107c0,0 0,22.91722 0,28.81096c0,2.60908 -1.73499,5.64612 -3.3122,5.64612c-3.94276,0 -20.6985,0 -20.6985,0z"
                        fill="currentcolor" stroke-width="0" />
                    <path
                        d="M246.7035,174.41504v-25.06639c0,0 16.00182,0 20.1027,0c1.80812,0 3.908,3.33201 3.908,5.84299c0,4.5545 0,19.2234 0,19.2234z"
                        fill="currentcolor" stroke-width="0" />
                    <path d="M204.04433,215.95567v-71.91134h71.91134v71.91134z" fill="none" stroke-width="0" />
                </g>
            </g>
        </svg>`,
        caffinatedSVG: `
        <svg class="layoutImage" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="71.91134"
            height="71.91134" viewBox="0,0,71.91134,71.91134">
            <g transform="translate(-204.04433,-144.04433)">
                <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-width="0"
                    stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
                    stroke-dashoffset="0" style="mix-blend-mode: normal">
                    <path d="M204.04433,215.95567v-71.91134h71.91134v71.91134z" fill="none" />
                    <path
                        d="M207.21689,205.55558c0,-3.89758 0,-22.58207 0,-22.58207h13.01655v25.33788c0,0 -8.77788,0 -10.98113,0c-0.94857,0 -2.03543,-1.39425 -2.03543,-2.75581z"
                        fill="currentcolor" />
                    <path
                        d="M251.74321,208.31139v-56.63951c0,0 14.48113,0 17.98145,0c1.4436,0 3.05845,1.67665 3.05845,3.56336c0,6.09486 0,39.17229 0,49.79204c0,2.06776 -1.47405,3.28411 -2.82542,3.28411c-3.43117,0 -18.21449,0 -18.21449,0z"
                        fill="currentcolor" />
                    <path
                        d="M207.21689,181.36822c0,0 0,-22.17721 0,-26.66127c0,-1.51291 1.30602,-3.03506 2.38497,-3.03506c2.27803,0 10.63158,0 10.63158,0v29.69633z"
                        fill="currentcolor" />
                    <path d="M221.82521,181.42211v-29.69633h28.35253v29.69633z" fill="currentcolor" />
                    <path d="M221.82521,208.45338v-25.33788h28.35253v25.33788z" fill="currentcolor" />
                </g>
            </g>
        </svg>
        `,
        emptySVG: `<svg class="layoutImage" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="71.91134"
    height="71.91134" viewBox="0,0,71.91134,71.91134">
    <g transform="translate(-204.04433,-144.04433)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-linecap="butt"
            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
            style="mix-blend-mode: normal">
            <path d="M204.04433,215.95567v-71.91134h71.91134v71.91134z" fill="none" stroke-width="0" />
            <path d="" fill="currentcolor" stroke-width="0.5" />
            <g fill="currentcolor">
                <path d="" stroke-width="0" />
                <path d="" stroke-width="0" />
                <path d="" stroke-width="0.5" />
                <path
                    d="M242.30836,209.4979c4.08809,-0.7637 8.02104,-4.0805 10.04759,-5.42325c2.57115,-1.70359 3.56612,-4.14981 3.93152,-4.58113c-0.13982,-0.18542 -1.64384,-2.13875 -2.39084,-3.28141c-0.29371,-0.44928 -0.38412,-0.77324 -0.35877,-0.81512c0,-0.63961 0.09214,-0.7351 0.7093,-0.7351c0.02082,0 0.0415,0.00059 0.06204,0.00175c0.35181,-0.1823 1.31776,0.77957 1.54616,0.99513c0.28947,0.2732 0.69411,0.77831 0.8566,0.94692c0.36321,0.37691 1.47553,1.36114 1.84973,2.25589c0.14425,0.19507 0.22998,0.43908 0.22998,0.70384c0,0.02158 -0.00057,0.04302 -0.00169,0.0643c0.29098,0.60313 -1.26074,1.7762 -1.57005,2.11253c-2.0609,2.24102 -4.29999,4.01898 -6.90987,5.54783c-3.81563,2.23518 -5.91936,2.65244 -9.81717,3.95854c-1.39931,0.46889 -3.44799,0.89769 -4.89151,0.52369c-1.49424,-0.38715 -2.77204,-1.54353 -4.19468,-2.13452c-1.85364,-0.77003 -3.09228,-1.59096 -4.32685,-3.34332c-0.41455,-0.58841 -0.93565,-1.3453 -1.37027,-2.12975c0.0719,0.04683 0.14369,0.09177 0.21533,0.13476c1.18762,0.71257 2.26252,0.98597 3.29413,1.0199c1.82,1.9426 2.51194,1.68315 4.57004,2.96293c0.28843,0.17935 4.4877,1.96873 8.51928,1.21558z"
                    stroke-width="0.5" />
                <path
                    d="M249.43113,157.68895c0.39074,0.25935 0.71348,0.58761 0.92811,1.00725c0.05146,-0.05264 0.10283,-0.10537 0.1541,-0.15821c0.84947,-0.87545 4.15703,-3.15005 5.49373,-2.97689c1.26441,0.1638 0.42322,2.17743 0.5037,3.18528c0.10831,1.35632 -0.27819,3.3838 -0.81699,5.39854c-0.4121,-0.4326 -0.90249,-0.77519 -1.41092,-0.94364c0.09931,-0.46817 0.19085,-0.93516 0.2695,-1.38965c0.41935,-2.42315 0.26686,-4.49126 0.26686,-4.49126c0,0 -1.02578,1.78919 -2.36519,3.19348c-0.47098,0.49379 -2.26137,2.81635 -3.63378,2.93801c-0.79555,0.07052 -2.94653,-0.97046 -4.28331,-2.4184c-1.02595,-1.11127 -1.39192,-2.5713 -1.39192,-3.29095c0,-1.19294 1.12204,-1.23457 1.87918,-1.14918c1.32365,0.14928 3.19329,0.29007 4.40692,1.09562z"
                    stroke-width="0.5" />
                <path d="" stroke-width="0.5" />
                <path d="" stroke-width="0.5" />
                <path d="" stroke-width="0.5" />
                <path
                    d="M255.44645,195.75719c-0.14143,0.63855 -0.75489,0.53345 -0.80571,0.54736c-0.56392,0.15432 -1.14054,-0.05292 -1.17153,-1.10574c-0.00071,-0.01691 -0.00106,-0.0339 -0.00106,-0.05099c0,-0.08086 0.42589,-3.24573 0.94019,-7.05379c0.6366,-1.41517 0.9838,-2.91788 0.63931,-4.43042c-0.00863,-0.0379 -0.01707,-0.07589 -0.02533,-0.11396c0.446,-3.30221 0.86288,-6.3964 1.05217,-7.8473c0.68695,-0.31405 1.32299,-0.66874 1.84754,-1.04145c0.22035,-0.09803 0.42335,-0.22798 0.60314,-0.38398c-0.48094,4.10127 -2.24012,17.69413 -3.07871,21.48027z"
                    stroke-width="0.5" />
                <path
                    d="M214.18788,193.64719c1.04632,-0.40665 5.18854,11.10002 5.40154,12.03857c0.28587,-0.24193 1.3919,-0.90269 2.66826,-1.0214c1.5091,-0.14036 3.21501,0.29144 3.49265,0.40882c-0.04969,-0.31691 -0.09328,-0.63859 -0.13511,-0.97095c0.10347,0.06966 0.20673,0.13548 0.3097,0.19726c0.73971,0.44383 1.4357,0.71728 2.10473,0.86861c0.08141,0.44488 0.18492,0.88752 0.33172,1.35394c0.08336,0.06088 0.16519,0.12264 0.24535,0.18527l0.04579,0.01654c0,0 0.02193,0.02273 0.05483,0.06441c0.11382,0.10305 1.39003,0.60268 0.74764,1.43487c-0.69808,0.90434 -6.74676,-1.77934 -6.90181,-1.93804c-0.23477,0.18768 -1.17869,0.25806 -1.87315,0.69263c-0.95815,0.59957 -1.6917,1.5682 -1.6917,1.5682c0,0 -0.92678,-0.43168 -1.44866,-1.46117c-0.54424,-1.07358 -0.69057,-2.75961 -0.99748,-3.4088l-0.17108,-0.98548c0,0 -0.01797,-0.11179 -0.00894,-0.27125c-0.59073,-0.75067 -0.95065,-1.59786 -1.45211,-2.50733l-0.40877,-0.84627c0,0 -0.3084,-0.63924 0.04388,-1.16447c-0.17438,-0.55741 -0.37419,-1.10644 -0.6046,-1.64055l-0.40665,-1.12236c0,0 -0.39237,-1.08438 0.65395,-1.49102z"
                    stroke-width="0.5" />
                <path
                    d="M213.26907,167.93449c-1.18047,1.06978 -2.46016,3.31167 -2.74999,4.11177c0.0499,0.18811 0.0499,0.33389 0.0499,0.33389l-0.00386,0.50504c-0.16868,2.08328 -0.54562,4.1105 -0.79381,6.18049c0,0 -0.70996,3.62649 -0.79368,4.19051c0.03521,-0.01824 2.22298,2.23242 2.22298,2.23242c0.36355,1.37872 1.14265,6.99619 1.32653,8.10343c0.08926,0.5375 -0.0342,3.85418 -0.04681,4.05407c0.05739,-0.12655 0.42205,-0.6288 0.59626,-1.21001c0.27106,-0.90434 0.56519,-2.08179 0.74813,-2.65179c0,0 1.47173,2.70445 1.15305,3.64581c-0.30742,0.90811 -1.02371,2.88406 -2.03263,4.32532c-0.93492,1.33554 -2.17857,2.17531 -2.17857,2.17531c0,0 0.0083,-1.49482 -0.16829,-2.93227c-0.10222,-0.83207 -0.45352,-1.64492 -0.41934,-2.13747c0.0482,-0.69464 0.05332,-1.39337 0.1354,-2.08459l0.13064,-1.21872c0,0 0.00021,-0.00194 0.00069,-0.00567c-0.07499,-0.5254 -0.04405,-1.06422 -0.1246,-1.58898c-0.08711,-0.56751 -0.44779,-3.26983 -0.86081,-4.50651c-0.57458,-1.72042 -1.7406,-3.35174 -2.00787,-3.39131c-1.10624,-0.16378 -0.94821,-1.31026 -0.94821,-1.31026c0.13136,-0.95289 0.26932,-1.90453 0.41694,-2.85475c-0.22967,-0.16337 1.33875,-8.22985 1.41677,-9.20739c0,0 1.48611,-5.17306 2.83195,-6.88263c1.70489,-2.16566 1.82039,-1.7875 4.47855,-3.80625c0.11569,-0.52711 2.66934,-11.96129 3.55353,-11.86874c1.48979,0.15595 3.95772,2.52527 3.95772,2.52527c1.40777,1.04213 2.57974,2.3132 3.68147,3.66324c0.40784,-0.18633 5.46406,0.85656 6.77153,1.24588c1.24455,0.37058 2.35671,0.96723 2.66193,1.19612c0.75664,0.56741 1.37904,1.30217 2.04468,1.98436c0,0 1.27913,-0.58946 2.44257,-1.40606c1.28239,-0.90009 2.41544,-2.21031 2.82669,-2.51498c0,0 0.97186,-0.51111 1.62138,0.43129c0.64952,0.9424 -0.25981,1.61554 -0.25981,1.61554c-0.75184,0.55612 -6.45196,5.29748 -6.45196,5.29748c0,0 -0.76266,-1.04035 -1.6552,-1.95029c-0.70714,-0.72092 -1.53073,-1.31172 -1.87515,-1.57833c-0.31036,-0.24024 -1.2825,-0.59751 -1.72589,-0.76458c-0.16284,0.03191 -1.68579,-0.21657 -3.01902,-0.49197c-1.07626,-0.41249 -2.24486,-0.6385 -3.46624,-0.6385c-2.0491,0 -3.94962,0.63615 -5.51484,1.72173c-0.89798,-1.0861 -1.55904,-1.89882 -1.55904,-1.89882l-1.21839,4.85263c-0.73338,1.21061 -1.20912,2.59468 -1.35121,4.07619c-0.17117,0.11347 -0.2973,0.1764 -0.2973,0.1764c0,0 -0.7757,-0.27637 -1.09793,-0.53573c-0.20318,-0.16355 -1.27657,-0.26993 -2.44884,0.79242z"
                    stroke-width="0.5" />
                <path
                    d="M262.45679,179.1086c-1.06012,0.36623 -1.4135,-0.73246 -1.4135,-0.73246l-0.10146,-0.31712c-0.33484,-1.15713 -0.39389,-2.56375 -0.9328,-3.59724c0,0 -0.20212,-0.41895 -0.0922,-0.85719c-0.02578,-0.13426 -0.02578,-0.2281 -0.02578,-0.2281l0.00459,-0.38853c0.2175,-2.47682 0.49608,-4.99946 0.31852,-7.48789l-0.95463,-0.17718c-1.30684,-0.4874 -2.5178,-1.0675 -3.83822,-1.4405c-0.30261,-0.26704 -0.63584,-0.48366 -0.98043,-0.62298c-0.11495,-0.20657 -0.17042,-0.48311 -0.08215,-0.84904c0.27103,-1.12354 1.35513,-0.84266 1.35513,-0.84266c1.44303,0.37388 2.72725,0.98528 4.12395,1.51781l1.45616,0.26187c0,0 0.76086,0.13915 0.90562,0.84171c0.16679,0.27369 0.19459,0.56178 0.19459,0.56178c0.26693,2.80687 -0.02743,5.64686 -0.27277,8.44677l0.00459,0.17883c0,0 0,0.1041 -0.03011,0.24987c0.49946,1.19576 0.61965,2.49976 0.98663,3.76709l0.08102,0.25023c0,0 0.35337,1.09869 -0.70675,1.46492z"
                    stroke-width="0.5" />
                <path
                    d="M256.63152,199.52643c0,0.35682 0.46787,0.82193 1.13968,0.96787c1.50864,0.32774 4.04572,-0.03876 4.62225,-0.35988c1.40616,-0.78321 2.20084,-2.30516 3.06714,-3.00341c0,0 -1.09471,-0.33896 -2.09719,-0.97315c-1.09331,-0.69166 -2.11828,-1.68623 -2.53882,-1.75684c-0.09289,-0.25318 -0.08481,-1.07376 -0.23297,-1.89962c-0.19946,-1.11182 -0.549,-2.25618 -0.549,-2.25618c0,0 0.96723,-1.13689 1.29904,-1.88359c0.45315,-1.01977 1.17114,-3.67531 1.17114,-3.67531c-0.0696,-0.92904 0.40872,-2.38921 0.54772,-3.59623c0.20443,-1.77511 0.11949,-3.20012 0.11949,-3.20012l-2.22947,0.03161l-0.66621,6.9516c0,0 -0.58048,2.02151 -0.9509,2.91944c-0.33538,0.81297 -1.17698,2.23864 -1.17698,2.23864c0,0 0.58842,1.76444 0.78356,3.3262c0.0755,0.60423 0.56593,1.75328 1.27491,2.54132c0.58868,0.65433 1.3874,1.00703 1.68261,1.07355c-0.20628,0.14211 -0.59191,1.36508 -1.50417,1.66145c-1.51476,0.49211 -3.76184,0.16984 -3.76184,0.89264z"
                    stroke-width="0.5" />
                <path
                    d="M259.11479,164.75338c1.11747,0 1.11747,-1.15812 1.11747,-1.15812l-0.00386,0.01194c0.02709,-0.33696 -0.40512,-12.71234 -0.40512,-12.71234c0,0 -0.82477,1.15738 -1.2516,3.41818c-0.44512,2.35766 -0.49307,5.85384 -0.49307,7.42891v0.67394c0,0 0,0.00926 0.0008,0.02613c-0.02607,0.32428 -0.08209,1.15326 -0.08209,1.15326c0,0 0,1.15812 1.11747,1.15812z"
                    stroke-width="0.5" />
                <path
                    d="M258.4715,159.66573c0.27825,-1.1154 0.79191,-2.50566 0.79191,-3.68105c0,-0.4245 -0.08931,-1.35251 -0.57705,-1.65203c0.4071,-0.31604 0.79977,-0.65698 1.17017,-1.03843l-0.05299,-2.43519c0,0 -2.18727,2.19241 -4.63932,3.84938c-2.83658,1.91682 -5.99416,3.35898 -5.99416,3.74809c0,1.15812 1.11747,1.15812 1.11747,1.15812l0.4963,-0.08283c1.32395,-0.55261 2.36589,-1.23316 3.38271,-2.27818c0,0 0.0496,-0.0514 0.11151,-0.14132l0.62853,-0.23085c0.15718,-0.11309 0.31557,-0.22326 0.47475,-0.33133c0.17704,0.78272 0.69483,1.8648 0.96264,2.31854c0.30086,0.50973 -1.09747,2.86857 -0.50654,3.63604c0.35427,0.46011 2.67555,1.5179 2.95522,0.48736c0.20591,-0.21007 0.33358,-0.50227 0.33358,-0.82537c0,-0.57875 -0.40962,-1.05834 -0.94479,-1.14437c-0.08374,-0.03584 0.27329,-1.28942 0.29004,-1.35657z"
                    stroke-width="0.5" />
            </g>
            <path
                d="M257.42508,161.01378c0.2422,0 0.2422,0.2422 0.2422,0.2422l-0.01243,0.17364c-0.12446,0.37337 -0.53012,1.43966 -1.05359,2.81272c-0.16971,-0.09506 -0.35453,-0.18305 -0.55512,-0.26329l-0.03998,-0.00545c-0.23226,-0.16774 -0.46892,-0.30259 -0.70682,-0.40659c0.13276,-0.26083 0.28252,-0.51497 0.4479,-0.76092l0.08756,-0.26268c0.03044,-0.09897 0.12259,-0.17091 0.23154,-0.17091c0.13377,0 0.2422,0.10844 0.2422,0.2422v0.15078c0.11072,0.02231 0.1941,0.12013 0.1941,0.23743l0,0.02185c0.25385,-0.57948 0.49694,-1.1612 0.69265,-1.74832l-0.01243,-0.02046c0,0 0,-0.2422 0.2422,-0.2422z"
                fill="currentcolor" stroke-width="0.5" />
            <path
                d="M261.15365,172.65768c0.02711,0.09941 -0.11244,0.17383 -0.15337,0.26839c-0.17124,0.39564 -1.37073,1.84956 -2.5409,2.8609c-0.06265,0.61 -0.57807,1.08582 -1.20463,1.08582c-0.15338,0 -0.3001,-0.02851 -0.43515,-0.08053c-0.41285,0.07576 -0.69335,-0.1288 -0.72435,-0.77991c-0.03351,-0.11098 -0.05152,-0.22867 -0.05152,-0.35058c0,-0.24918 0.07526,-0.48078 0.20428,-0.67332c0.86169,-1.94518 4.11199,-5.24077 4.90563,-2.33077z"
                fill="currentcolor" stroke-width="0.5" />
            <path
                d="M264.12897,169.04528c0,-0.73544 0.59619,-1.33162 1.33162,-1.33162c0.73544,0 1.33162,0.59619 1.33162,1.33162c0,0.73544 -0.59619,1.33162 -1.33162,1.33162c-0.73544,0 -1.33162,-0.59619 -1.33162,-1.33162z"
                fill="currentcolor" stroke-width="0.5" />
            <path
                d="M262.852,152.01199c-0.81826,-1.05056 0.2323,-1.86882 0.2323,-1.86882l1.20162,-0.8493c2.03057,-0.7178 3.61697,-1.76931 5.87715,-0.84816c4.16644,1.69804 4.66046,10.74855 0.20176,12.49752c-1.05871,0.41529 -2.26527,-0.24939 -3.37556,-0.49551c-0.16521,-0.03662 0.31547,0.20574 0.34507,0.37236c0.08101,0.45586 -0.03549,0.92564 -0.03215,1.38862c0.00461,0.63851 0.03732,1.2765 0.05598,1.91476c0,0 0.03859,1.33106 -1.29248,1.36965c-1.33106,0.03859 -1.36965,-1.29248 -1.36965,-1.29248c-0.03208,-1.11561 -0.50961,-5.0857 0.6567,-5.85403c1.11966,-0.73759 2.72169,0.45815 4.02039,0.1249c0.63472,-0.16287 0.67261,-1.13144 0.91259,-1.7412c0.65846,-1.67305 0.98836,-4.93289 -1.20296,-5.85028c-1.23096,-0.51534 -2.80067,0.53249 -3.90875,0.92466l-0.45321,0.43961c0,0 -1.05056,0.81826 -1.86882,-0.2323z"
                fill="currentcolor" stroke-width="0.5" />
        </g>
    </g>
</svg>
<!--rotationCenter:35.95566940307617:35.95566940307617-->`,
    };

    editor.language = Object.assign({}, editor.EnglishLang, editor.Storage.getStorage("language", {}));
    editor.languageName = editor.Storage.getStorage("languageName", "English");

    editor.layout = editor.Storage.getStorage("layout", {});

    editor.setup.initilizeLang = (goToOptions) => {
        console.log("Initilizing Setup");

        editor.changePage();

        editor.currentPage.root = document.createElement("div");

        editor.currentPage.root.style.position = "absolute";
        editor.currentPage.root.style.top = "0px";
        editor.currentPage.root.style.left = "0px";
        editor.currentPage.root.style.width = "100%";
        editor.currentPage.root.style.height = "100%";

        editor.currentPage.root.innerHTML = `
        <style>
            .CenterPanel {
                width:0%;
                height:0%;

                position:absolute;

                top:50%;
                left:50%;
                opacity:0%;

                display: flex;
                flex-direction: column;

                transform:translate(-50%,-50%);

                background-color: var(--background-2);

                animation: boot 500ms cubic-bezier(0.65, 0, 0.35, 1) 1;
                animation-fill-mode: forwards;
            }

            .innerBox {
                width:100%; 
                height:80%; 
                margin-top:0px;
                background-color: var(--background-3);
                flex-grow: 1;

                border-top: 8px solid var(--background-4);

                overflow-y: scroll;
            }

            .centerText {
                text-align: center;
            }

            @keyframes boot {
                0% {
                    opacity:0%;
                    width:0%;
                    height:0%;
                }
                100% {
                    opacity:100%;
                    width:80%;
                    height:80%;
                }
            }
        </style>
        <div id="centerPanel" class="CenterPanel CenterPanel-Setup-Language">
            <h1 class="centerText" style="margin:2px; margin-top:4px;">${editor.language["engine.setup.start"]}</h1>
            <h2 class="centerText" style="margin:2px; margin-bottom:4px;">${editor.language["engine.setup.languageSelect"]}</h2>
            <div class="innerBox" id="languages">
                <h1 style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);">Fetching Languages</h1>
            </div>
        </div>
        `;

        editor.pageRoot.appendChild(editor.currentPage.root);

        const languageContainer = document.getElementById("languages");

        fetch("https://raw.githubusercontent.com/ObviousStudios/CE-LANG/main/Languages.json")
            .then((response) => response.json())
            .then((response) => {
                languageContainer.innerHTML = "";
                response.forEach((langDef) => {
                    const button = document.createElement("button");
                    button.style.width = "100%";
                    button.style.height = "48px";

                    button.style.fontSize = "x-Large";

                    button.innerHTML = langDef.Name;

                    button.setAttribute("languageURL", `https://raw.githubusercontent.com/ObviousStudios/CE-LANG/main/LANG/${langDef.File}.json`);

                    languageContainer.appendChild(button);

                    button.onclick = () => {
                        fetch(button.getAttribute("languageURL"))
                            .then((response) => response.json())
                            .then((response) => {
                                //set the language
                                editor.Storage.setStorage("language", response);
                                editor.language = Object.assign({}, editor.EnglishLang, response);

                                //Set the language name
                                editor.Storage.setStorage("languageName", langDef.Name);

                                if (!goToOptions) editor.setup.initilizeLayout();
                                else editor.settings.initilize();
                            })
                            .catch((error) => {
                                button.innerText += ` : ${error}`;
                                button.onclick = () => {};
                            });
                    };
                });
            })
            .catch((error) => {
                editor.setup.initilizeLayout();
            });
    };

    editor.setup.initilizeLayout = (goToOptions) => {
        console.log("Initilizing Setup Part 2");

        editor.changePage();

        editor.currentPage.root = document.createElement("div");

        editor.currentPage.root.style.position = "absolute";
        editor.currentPage.root.style.top = "0px";
        editor.currentPage.root.style.left = "0px";
        editor.currentPage.root.style.width = "100%";
        editor.currentPage.root.style.height = "100%";

        editor.currentPage.root.innerHTML = `
        <style>
            .CenterPanel {
                width:0%;
                height:0%;

                position:absolute;

                top:50%;
                left:50%;
                opacity:0%;

                display: flex;
                flex-direction: column;

                transform:translate(-50%,-50%);

                background-color: var(--background-2);

                animation: boot 500ms cubic-bezier(0.65, 0, 0.35, 1) 1;
                animation-fill-mode: forwards;
            }

            .innerBox {
                width:100%; 
                height:80%; 
                margin-top:0px;
                background-color: var(--background-3);
                flex-grow: 1;

                border-top: 8px solid var(--background-4);

                display:grid;
                grid-template-columns: 1fr 1fr 1fr;

                overflow-y: hidden;
            }

            .centerText {
                text-align: center;
            }

            .layoutDiv {
                margin: 16px;
                background-color: var(--background-1);
                aspect-ratio: 1; 
                transition: all 100ms;
            }

            .layoutDiv:hover {
                background-color: var(--background-2);
            }

            .layoutDiv:active {
                background-color: var(--background-4);
            }

            .layoutImage {
                width: 80%;
                height: 80%;
                aspect-ratio: 1;
                margin-top:0%;
                margin-left:10%;
            }

            @keyframes boot {
                0% {
                    opacity:0%;
                    width:0%;
                    height:0%;
                }
                100% {
                    opacity:100%;
                    width:80%;
                    height:80%;
                }
            }
        </style>
        <div id="centerPanel" class="CenterPanel CenterPanel-Setup-Layout">
            <h1 class="centerText" style="margin:2px; margin-top:4px;">${editor.language["engine.setup.start"]}</h1>
            <h2 class="centerText" style="margin:2px; margin-bottom:4px;">${editor.language["engine.setup.layoutSelect"]}</h2>
            <div class="innerBox" id="layouts">
                <div id="scratched" class="layoutDiv">
                    <h1 class="centerText">Scratched</h1>
                    ${editor.setup.scratchedSVG}
                </div>
                <div id="caffinated" class="layoutDiv">
                    <h1 class="centerText">Caffinated</h1>
                    ${editor.setup.caffinatedSVG}
                </div>
                <div id="empty" class="layoutDiv">
                    <h1 class="centerText">Blank</h1>
                    ${editor.setup.emptySVG}
                </div>
            </div>
        </div>
        `;

        editor.pageRoot.appendChild(editor.currentPage.root);

        const onSelect = () => {
            if (!goToOptions) editor.home.initilize();
            else editor.settings.initilize();
        };

        document.getElementById("scratched").onclick = () => {
            editor.layout = {
                layout: [
                    {
                        size: 70,
                        contents: [
                            {
                                size: 80,
                                content: ["codeEditor", "fileExplorer"],
                            },
                            {
                                size: 20,
                                content: "debugLog",
                            },
                        ],
                    },
                    {
                        size: 30,
                        contents: [
                            {
                                size: 50,
                                content: "viewport",
                            },
                            {
                                size: 20,
                                content: "properties",
                            },
                            {
                                size: 30,
                                content: "sceneTree",
                            },
                        ],
                    },
                ],
                floating: [],
            };
            editor.Storage.setStorage("layout", editor.layout);
            onSelect();
        };

        document.getElementById("caffinated").onclick = () => {
            editor.layout = {
                layout: [
                    {
                        size: 20,
                        contents: [
                            {
                                size: 40,
                                content: "sceneTree",
                            },
                            {
                                size: 60,
                                content: "fileExplorer",
                            },
                        ],
                    },
                    {
                        size: 60,
                        contents: [
                            {
                                size: 70,
                                content: ["viewport", "codeEditor"],
                            },
                            {
                                size: 30,
                                content: "debugLog",
                            },
                        ],
                    },
                    {
                        size: 20,
                        contents: [
                            {
                                size: 100,
                                content: "properties",
                            },
                        ],
                    },
                ],
                floating: [],
            };
            editor.Storage.setStorage("layout", editor.layout);
            onSelect();
        };

        //Give an empty layout with a single viewport. The viewport is essential.
        document.getElementById("empty").onclick = () => {
            editor.layout = {
                layout: [],
                floating: [
                    {
                        content: ["viewport", "codeEditor"],
                        x: 37.5,
                        y: 37.5,
                        width: 25,
                        height: 25,
                    },
                ],
            };
            editor.Storage.setStorage("layout", editor.layout);
            onSelect();
        };
    };
})();
