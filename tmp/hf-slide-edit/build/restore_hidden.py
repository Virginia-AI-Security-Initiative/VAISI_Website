from pathlib import Path
from zipfile import ZipFile
import os
import sys
source=Path(sys.argv[1])
target=source.with_suffix('.hidden.pptx')
hidden={'ppt/slides/slide10.xml','ppt/slides/slide16.xml','ppt/slides/slide17.xml'}
with ZipFile(source) as zin, ZipFile(target,'w') as zout:
    for item in zin.infolist():
        data=zin.read(item.filename)
        if item.filename in hidden:
            data=data.replace(b'<p:sld ',b'<p:sld show="0" ',1)
        zout.writestr(item,data)
os.replace(target,source)
